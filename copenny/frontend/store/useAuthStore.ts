import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        // Save token to cookie for Next.js proxy middleware
        Cookies.set('auth_token', token, { expires: 7, path: '/' });
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove('auth_token', { path: '/' });
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
