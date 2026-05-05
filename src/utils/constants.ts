// API Configuration
export const API_BASE_URL = 'https://whisperbox.koyeb.app';
export const WS_URL = 'wss://whisperbox.koyeb.app/ws';

// Token Configuration
export const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000; // 15 minutes in ms
export const REFRESH_BUFFER = 2 * 60 * 1000; // Refresh 2 minutes before expiry

// Crypto Configuration
export const RSA_KEY_SIZE = 2048;
export const AES_KEY_SIZE = 256;
export const PBKDF2_ITERATIONS = 100000;
export const PBKDF2_SALT_LENGTH = 16; // 128 bits
export const AES_GCM_IV_LENGTH = 12; // 96 bits

// Validation Rules
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 32;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

// UI Configuration
export const MESSAGE_PAGE_SIZE = 50;
export const MAX_MESSAGE_LENGTH = 10000;
export const WEBSOCKET_RECONNECT_DELAY = 3000;