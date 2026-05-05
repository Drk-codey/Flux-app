import type { KeyPair, ExportedKeys } from './types';

/**
 * Generate a new RSA-OAEP key pair (2048-bit)
 */
export async function generateKeyPair(): Promise<KeyPair> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]), // 65537
      hash: 'SHA-256',
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );

  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
  };
}

/**
 * Generate a random 128-bit salt for PBKDF2
 */
export function generateSalt(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(16));
}

/**
 * Derive an AES-KW key from password using PBKDF2
 */
export async function deriveWrappingKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  // Import password as key material
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive AES-KW key
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any, // Cast to any to bypass strict BufferSource check in modern TS
      iterations: 100000, // OWASP recommended minimum
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false, // not extractable
    ['wrapKey', 'unwrapKey']
  );
}

/**
 * Wrap (encrypt) private key with password-derived AES-KW key
 */
export async function wrapPrivateKey(
  privateKey: CryptoKey,
  password: string,
  salt: Uint8Array
): Promise<ArrayBuffer> {
  const wrappingKey = await deriveWrappingKey(password, salt);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const wrapped = await window.crypto.subtle.wrapKey(
    'pkcs8',
    privateKey,
    wrappingKey,
    { name: 'AES-GCM', iv }
  );

  // Prepend IV to the wrapped key
  const combined = new Uint8Array(iv.length + wrapped.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(wrapped), iv.length);
  
  return combined.buffer as ArrayBuffer;
}

/**
 * Unwrap (decrypt) private key with password
 */
export async function unwrapPrivateKey(
  wrappedData: ArrayBuffer,
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const wrappingKey = await deriveWrappingKey(password, salt);
  
  // Extract IV from the beginning
  const data = new Uint8Array(wrappedData);
  const iv = data.slice(0, 12);
  const wrappedKey = data.slice(12);

  return window.crypto.subtle.unwrapKey(
    'pkcs8',
    wrappedKey,
    wrappingKey,
    { name: 'AES-GCM', iv },
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true, // extractable
    ['decrypt']
  );
}

/**
 * Export public key to Base64 (SPKI format)
 */
export async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('spki', publicKey);
  return arrayBufferToBase64(exported);
}

/**
 * Import public key from Base64 (SPKI format)
 */
export async function importPublicKey(base64Key: string): Promise<CryptoKey> {
  const keyData = base64ToArrayBuffer(base64Key);
  
  return window.crypto.subtle.importKey(
    'spki',
    keyData,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt']
  );
}

/**
 * Complete key setup for registration
 * Returns all the data needed for POST /auth/register
 */
export async function setupKeysForRegistration(
  password: string
): Promise<ExportedKeys> {
  // 1. Generate RSA keypair
  const keyPair = await generateKeyPair();

  // 2. Generate salt
  const salt = generateSalt();

  // 3. Wrap private key
  const wrappedPrivateKey = await wrapPrivateKey(
    keyPair.privateKey,
    password,
    salt
  );

  // 4. Export public key
  const publicKey = await exportPublicKey(keyPair.publicKey);

  return {
    publicKey,
    wrappedPrivateKey: arrayBufferToBase64(wrappedPrivateKey),
    pbkdf2Salt: arrayBufferToBase64(salt),
  };
}

/**
 * Restore private key from login response
 */
export async function restorePrivateKey(
  wrappedPrivateKeyBase64: string,
  pbkdf2SaltBase64: string,
  password: string
): Promise<CryptoKey> {
  const wrappedKey = base64ToArrayBuffer(wrappedPrivateKeyBase64);
  const salt = base64ToArrayBuffer(pbkdf2SaltBase64);

  return unwrapPrivateKey(wrappedKey, password, new Uint8Array(salt));
}

// Helper functions
function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer as ArrayBuffer;
}