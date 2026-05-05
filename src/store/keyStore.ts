import { create } from 'zustand';

interface KeyState {
  privateKey: CryptoKey | null;
  publicKey: CryptoKey | null;
  
  setKeys: (privateKey: CryptoKey, publicKey: CryptoKey) => void;
  clearKeys: () => void;
}

export const useKeyStore = create<KeyState>((set) => ({
  privateKey: null,
  publicKey: null,

  setKeys: (privateKey, publicKey) =>
    set({ privateKey, publicKey }),

  clearKeys: () =>
    set({ privateKey: null, publicKey: null }),
}));