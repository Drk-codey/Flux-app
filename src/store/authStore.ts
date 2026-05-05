import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '../lib/api/types';

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  
  setAuth: (user: UserProfile, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      updateAccessToken: (token) =>
        set({ accessToken: token }),
    }),
    {
      name: 'flux-auth',
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        // Don't persist access token (expires in 15min)
      }),
    }
  )
);