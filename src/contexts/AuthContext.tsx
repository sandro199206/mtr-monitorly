/**
 * Authentication Context Provider
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = apiClient.getToken();
    if (token) {
      // In a real app, you might want to validate the token with the backend
      // For now, we'll just set a placeholder user
      // You could decode the JWT to get user info
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const { user } = await apiClient.login(username, password);
    setUser(user);
  };

  const register = async (username: string, email: string, password: string) => {
    const { user } = await apiClient.register(username, email, password);
    setUser(user);
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user || !!apiClient.getToken(),
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
