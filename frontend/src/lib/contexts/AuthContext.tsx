import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  modules: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasModule: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      const savedToken = localStorage.getItem('auth_token');
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.get('/auth/me', {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        setUser(response.data.user);
        setToken(savedToken);
      } catch (error: any) {
        // Token invalid or expired - clear and continue as unauthenticated
        console.warn('Token validation failed:', error?.message);
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem('auth_token', newToken);
      setToken(newToken);
      setUser(userData);
    } catch (error: any) {
      console.error('Login failed:', error?.response?.data || error?.message);
      throw new Error(error?.response?.data?.error || 'Falha ao fazer login');
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  }, []);

  const hasModule = useCallback(
    (module: string) => {
      // If no user, no access
      if (!user) return false;

      // Admin has access to everything
      if (user.role === 'ADMIN') return true;

      // Check if module exists in user's modules
      if (!user.modules || !Array.isArray(user.modules)) {
        // If no modules defined, allow access for now (backward compatibility)
        return true;
      }

      return user.modules.includes(module);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        hasModule,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
