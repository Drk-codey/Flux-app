import { useCallback } from 'react';
import { encryptMessage, decryptMessage } from '../lib/crypto/encryption';
import { importPublicKey } from '../lib/crypto/keyManagement';
import { useKeyStore } from '../store/keyStore';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../lib/api/client';

export function useEncryption() {
  const { privateKey, publicKey } = useKeyStore();
  const currentUserId = useAuthStore((state) => state.user?.id);

  const encrypt = useCallback(
    async (plaintext: string, recipientId: string) => {
      if (!publicKey) throw new Error('No public key available');

      // Fetch recipient's public key
      const { public_key } = await apiClient.getUserPublicKey(recipientId);
      const recipientPublicKey = await importPublicKey(public_key);

      // Encrypt
      return encryptMessage(plaintext, recipientPublicKey, publicKey);
    },
    [publicKey]
  );

  const decrypt = useCallback(
    async (payload: any, fromUserId: string) => {
      if (!privateKey) throw new Error('No private key available');

      const isSentByMe = fromUserId === currentUserId;
      return decryptMessage(payload, privateKey, isSentByMe);
    },
    [privateKey, currentUserId]
  );

  return { encrypt, decrypt };
}