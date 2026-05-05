import type { EncryptedMessage } from './types';

/**
 * Generate a random 256-bit AES-GCM key
 */
async function generateMessageKey(): Promise<CryptoKey> {
  return window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a random 96-bit IV for AES-GCM
 */
function generateIV(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(12));
}

/**
 * Encrypt a message for a recipient
 * 
 * @param plaintext - The message to encrypt
 * @param recipientPublicKey - Recipient's RSA-OAEP public key
 * @param senderPublicKey - Your own RSA-OAEP public key (to encrypt for yourself)
 * @returns EncryptedMessage payload
 */
export async function encryptMessage(
  plaintext: string,
  recipientPublicKey: CryptoKey,
  senderPublicKey: CryptoKey
): Promise<EncryptedMessage> {
  // 1. Generate random AES-GCM key
  const aesKey = await generateMessageKey();

  // 2. Generate random IV
  const iv = generateIV();

  // 3. Encrypt plaintext with AES-GCM
  const encodedText = new TextEncoder().encode(plaintext);
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as any }, // Cast to any to bypass strict BufferSource check in modern TS
    aesKey,
    encodedText
  );

  // 4. Export AES key
  const exportedAesKey = await window.crypto.subtle.exportKey('raw', aesKey);

  // 5. Encrypt AES key with recipient's RSA public key
  const encryptedKey = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    recipientPublicKey,
    exportedAesKey
  );

  // 6. Encrypt AES key with sender's RSA public key (for self)
  const encryptedKeyForSelf = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    senderPublicKey,
    exportedAesKey
  );

  // 7. Convert to base64
  return {
    ciphertext: arrayBufferToBase64(ciphertext),
    iv: arrayBufferToBase64(iv),
    encryptedKey: arrayBufferToBase64(encryptedKey),
    encryptedKeyForSelf: arrayBufferToBase64(encryptedKeyForSelf),
  };
}

/**
 * Decrypt a message received from someone
 * 
 * @param encrypted - The encrypted payload
 * @param privateKey - Your RSA-OAEP private key
 * @param isSentByMe - True if you sent this message (uses encryptedKeyForSelf)
 * @returns Decrypted plaintext
 */
export async function decryptMessage(
  encrypted: EncryptedMessage,
  privateKey: CryptoKey,
  isSentByMe: boolean = false
): Promise<string> {
  // 1. Choose the right encrypted key
  const encryptedAesKeyBase64 = isSentByMe
    ? encrypted.encryptedKeyForSelf
    : encrypted.encryptedKey;

  // 2. Decrypt AES key with RSA private key
  const encryptedAesKey = base64ToArrayBuffer(encryptedAesKeyBase64);
  const aesKeyData = await window.crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    encryptedAesKey
  );

  // 3. Import AES key
  const aesKey = await window.crypto.subtle.importKey(
    'raw',
    aesKeyData,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  // 4. Decrypt ciphertext
  const ciphertext = base64ToArrayBuffer(encrypted.ciphertext);
  const iv = base64ToArrayBuffer(encrypted.iv);

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    ciphertext
  );

  // 5. Decode to string
  return new TextDecoder().decode(decrypted);
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