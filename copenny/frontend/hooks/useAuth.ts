import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (credentials: Record<string, unknown>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { user: authUser, token: authToken } = response.data;
      setAuth(authUser, authToken);
      router.push('/');
      return true;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const errorData = (err as { response?: { data?: { error?: string } } }).response?.data?.error;
        setError(errorData || 'Login failed');
      } else {
        setError('Login failed');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Record<string, unknown>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/auth/register', userData);
      const { user: authUser, token: authToken } = response.data;
      setAuth(authUser, authToken);
      router.push('/');
      return true;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const errorData = (err as { response?: { data?: { error?: string } } }).response?.data?.error;
        setError(errorData || 'Registration failed');
      } else {
        setError('Registration failed');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storeLogout();
    router.push('/login');
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}
