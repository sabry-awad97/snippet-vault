'use client';

import { User, userSchema } from '@/lib/schemas/user';
import { invoke } from '@tauri-apps/api/tauri';
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import { z } from 'zod';

const AuthPayload = z.object({
  token: z.string(),
  user: userSchema,
});

type AuthPayload = z.infer<typeof AuthPayload>;

interface AuthContextType {
  authToken: string | null;
  user: AuthPayload['user'] | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<void>;
  refreshAuthToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  });

  const [user, setUser] = useState<AuthPayload['user'] | null>(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? (JSON.parse(user) as AuthPayload['user']) : null;
    }
    return null;
  });

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken);
    } else {
      localStorage.removeItem('authToken');
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [authToken, user]);

  const login = async (username: string, password: string) => {
    try {
      const response = await invoke('login_user', {
        params: { data: { username, password } },
      });
      const { token, user } = AuthPayload.parse(response);
      setAuthToken(token);
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    try {
      const response = await invoke('register_user', { params: { data } });
      const { token, user } = AuthPayload.parse(response);
      setAuthToken(token);
      setUser(user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    setAuthToken(null);
    setUser(null);
  };

  const refreshAuthToken = async () => {
    try {
      const response = await invoke('refresh_token', {
        params: { token: authToken },
      });
      const { token } = AuthPayload.parse(response);
      setAuthToken(token);
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ authToken, user, login, logout, register, refreshAuthToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
