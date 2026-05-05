export interface KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

export interface EncryptedMessage {
  ciphertext: string;      // Base64 AES-GCM encrypted message
  iv: string;              // Base64 96-bit initialization vector
  encryptedKey: string;    // Base64 RSA-OAEP encrypted AES key (for recipient)
  encryptedKeyForSelf: string; // Base64 RSA-OAEP encrypted AES key (for sender)
}

export interface WrappedPrivateKey {
  wrappedKey: string;      // Base64 AES-KW encrypted private key
  salt: string;            // Base64 PBKDF2 salt
}

export interface ExportedKeys {
  publicKey: string;       // Base64 SPKI format
  wrappedPrivateKey: string;
  pbkdf2Salt: string;
}