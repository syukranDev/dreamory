import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import type { AuthUser } from '../services/auth.service';
import { authService } from '../services/auth.service';

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  init: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as AuthUser;
    } catch (error) {
      console.error('Failed to parse stored user data:', error);
      return null;
    }
  });
  const [init, setInit] = useState<boolean>(true);

  useEffect(() => {
    let isActive = true;

    const validateToken = async () => {
      if (!token) {
        setInit(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        if (!isActive) return;
        localStorage.setItem('user', JSON.stringify(currentUser));
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to validate auth token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!isActive) return;
        setToken(null);
        setUser(null);
      } finally {
        if (isActive) {
          setInit(false);
        }
      }
    };

    validateToken();

    return () => {
      isActive = false;
    };
  }, [token]);

  const login = useCallback((nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem('token', nextToken);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
    setInit(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setInit(false);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      init,
      login,
      logout,
    }),
    [token, user, init, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};


