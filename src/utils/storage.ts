/**
 * Secure storage utilities for Flux
 * 
 * IMPORTANT SECURITY NOTES:
 * - Private keys should NEVER be stored in any persistent storage
 * - Only store encrypted private keys (wrapped with password)
 * - Access tokens can be stored but have short expiry (15 min)
 * - Refresh tokens should ideally be in httpOnly cookies (not available in this implementation)
 */

const STORAGE_PREFIX = 'flux_';

export const StorageKeys = {
  REFRESH_TOKEN: `${STORAGE_PREFIX}refresh_token`,
  USER_PROFILE: `${STORAGE_PREFIX}user_profile`,
} as const;

/**
 * Get item from localStorage
 */
export function getStorageItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error('Storage get error:', err);
    return null;
  }
}

/**
 * Set item in localStorage
 */
export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage set error:', err);
  }
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error('Storage remove error:', err);
  }
}

/**
 * Clear all Flux-related items from localStorage
 */
export function clearAllStorage(): void {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (err) {
    console.error('Storage clear error:', err);
  }
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(expiresAt: number): boolean {
  return Date.now() >= expiresAt;
}

/**
 * Check if a token needs refresh (within 2 minutes of expiry)
 */
export function shouldRefreshToken(expiresAt: number): boolean {
  const REFRESH_BUFFER = 2 * 60 * 1000; // 2 minutes
  return Date.now() >= expiresAt - REFRESH_BUFFER;
}