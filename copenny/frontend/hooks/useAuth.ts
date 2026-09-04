'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async ({ email, password }: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = credential.user;
      const token = await fbUser.getIdToken();
      setAuth(
        {
          uid: fbUser.uid,
          email: fbUser.email ?? '',
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
        },
        token
      );
      router.push('/');
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Invalid email or password');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({ name, email, password }: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = credential.user;
      // Set the display name
      await updateProfile(fbUser, { displayName: name });
      const token = await fbUser.getIdToken();
      setAuth(
        {
          uid: fbUser.uid,
          email: fbUser.email ?? '',
          displayName: name,
          photoURL: fbUser.photoURL,
        },
        token
      );
      router.push('/');
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please sign in.');
      } else if (code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Registration failed. Please try again.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const fbUser = credential.user;
      const token = await fbUser.getIdToken();
      setAuth(
        {
          uid: fbUser.uid,
          email: fbUser.email ?? '',
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
        },
        token
      );
      router.push('/');
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Please try again.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    storeLogout();
    router.push('/login');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
  };
}
