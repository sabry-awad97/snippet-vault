'use client';

import { RegisterFormData, userSchema } from '@/lib/schemas/user';
import { login, refreshToken, register } from '@/lib/tauri/commands';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
} from 'react';
import { z } from 'zod';

// Types and schemas
const AuthPayload = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: userSchema,
});

type AuthPayload = z.infer<typeof AuthPayload>;

interface AuthContextType {
  user: AuthPayload['user'] | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

// Constants
const AUTH_QUERY_KEY = ['auth'];
const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

// Helper functions
const getStoredAuthData = (): {
  token: string;
  user: AuthPayload['user'];
} | null => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  if (token && user) {
    return { token, user: JSON.parse(user) as AuthPayload['user'] };
  }
  return null;
};

const setStoredAuthData = (data: AuthPayload) => {
  localStorage.setItem('authToken', data.accessToken);
  localStorage.setItem('user', JSON.stringify(data.user));
};

const clearStoredAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// Context creation
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const queryClient = useQueryClient();

  // Auth data query
  const { data: authData } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getStoredAuthData,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await login({ data: { email, password } });
      return AuthPayload.parse(response);
    },
    onSuccess: data => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data);
      setStoredAuthData(data);
    },
    onError: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await register({ data });
      return AuthPayload.parse(response);
    },
    onSuccess: data => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data);
      setStoredAuthData(data);
    },
    onError: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      clearStoredAuthData();
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    },
  });

  // Refresh token mutation
  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Auth token not found');
      const response = await refreshToken({ data: token });
      return AuthPayload.parse(response);
    },
    onSuccess: data => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data);
      setStoredAuthData(data);
    },
    onError: () => {
      logoutMutation.mutate();
    },
  });

  // Auto refresh effect
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (authData?.token) {
        refreshTokenMutation.mutate();
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(refreshInterval);
  }, [authData?.token, refreshTokenMutation]);

  // Context value
  const contextValue: AuthContextType = {
    user: authData?.user ?? null,
    accessToken: authData?.token ?? null,
    login: useCallback(
      async (email: string, password: string) => {
        await loginMutation.mutateAsync({ email, password });
      },
      [loginMutation],
    ),
    logout: useCallback(async () => {
      await logoutMutation.mutateAsync();
    }, [logoutMutation]),
    register: useCallback(
      async (data: RegisterFormData) => {
        await registerMutation.mutateAsync(data);
      },
      [registerMutation],
    ),
    refreshAccessToken: useCallback(async () => {
      await refreshTokenMutation.mutateAsync();
    }, [refreshTokenMutation]),
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
