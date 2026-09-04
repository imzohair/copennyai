import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  name: string;
  firebase_uid?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        // Save token to cookie for Next.js middleware
        Cookies.set('auth_token', token, { expires: 7, path: '/' });
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove('auth_token', { path: '/' });
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      // Only store user info in localStorage, token is in cookie + state
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
