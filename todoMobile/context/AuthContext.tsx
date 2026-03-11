import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getStoredToken, setStoredToken } from '@/lib/storage';
import * as api from '@/lib/api';

type User = any;

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = getStoredToken();
    if (t) {
      setToken(t);
      api
        .me()
        .then((u) => setUser(u))
        .catch(() => {
          setStoredToken(null);
          setUser(null);
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      loading,
      login: async (email, password) => {
        const res = await api.login({ email, password });
        const t = res.token;
        setStoredToken(t ?? null);
        setToken(t ?? null);
        if (t) {
          try {
            const u = await api.me();
            setUser(u);
          } catch {
            setUser(null);
          }
        }
      },
      register: async (name, email, password) => {
        const res = await api.register({ name, email, password, password_confirmation: password });
        const t = res.token;
        setStoredToken(t ?? null);
        setToken(t ?? null);
        if (t) {
          try {
            const u = await api.me();
            setUser(u);
          } catch {
            setUser(null);
          }
        }
      },
      logout: async () => {
        try {
          await api.logout();
        } catch {}
        setStoredToken(null);
        setUser(null);
        setToken(null);
      },
      refreshUser: async () => {
        const u = await api.me();
        setUser(u);
      },
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

