'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { login as apiLogin, logout as apiLogout, getMe as apiGetMe, AuthUser } from '@/lib/api/auth';

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_COOKIE = 'tzw-access-token';

const setAccessCookie = (token: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${ACCESS_COOKIE}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

const clearAccessCookie = () => {
  if (typeof document === 'undefined') return;
  document.cookie = `${ACCESS_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate and validate from backend on mount
  useEffect(() => {
    // Safety net: ensure isLoading is always cleared within 5 seconds
    // This prevents an infinite loading spinner if anything goes wrong.
    const safetyTimer = setTimeout(() => setIsLoading(false), 5000);

    const hydrateAndValidate = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('authUser');
        if (storedToken && storedUser) {
          // Immediately restore from localStorage so the UI renders
          setAccessCookie(storedToken);
          setAccessToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Check if token is still valid (not expired) before hitting the backend
          const isTokenExpired = (() => {
            try {
              const payload = JSON.parse(atob(storedToken.split('.')[1]));
              return payload.exp * 1000 < Date.now();
            } catch {
              return true; // treat unparseable token as expired
            }
          })();

          if (!isTokenExpired) {
            // Token still valid — trust localStorage, skip the /me call
            return;
          }

          // Token expired — try to refresh first
          const storedRefreshToken = localStorage.getItem('refreshToken');
          if (storedRefreshToken) {
            try {
              const axiosInstance = (await import('axios')).default;
              const { data: refreshPayload } = await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/refresh`,
                { refreshToken: storedRefreshToken },
                { withCredentials: false } // avoid CORS credential/wildcard conflict
              );
              // unwrap the envelope
              const newToken =
                refreshPayload?.data?.accessToken ?? refreshPayload?.accessToken;
              if (newToken) {
                localStorage.setItem('accessToken', newToken);
                setAccessCookie(newToken);
                setAccessToken(newToken);
                // Now verify with fresh token
                const freshUser = await apiGetMe();
                setUser(freshUser);
                localStorage.setItem('authUser', JSON.stringify(freshUser));
                return;
              }
            } catch {
              // Refresh failed — fall through to clear state
            }
          }

          // Both token and refresh failed — clear everything
          throw new Error('Session expired');
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authUser');
        clearAccessCookie();
        setAccessToken(null);
        setUser(null);
      } finally {
        clearTimeout(safetyTimer);
        setIsLoading(false);
      }
    };
    hydrateAndValidate();

    return () => clearTimeout(safetyTimer);
  }, []);

  // Fix browser back button (BFcache restore)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiLogin({ email, password });
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('authUser', JSON.stringify(response.user));
    setAccessCookie(response.accessToken);
    setAccessToken(response.accessToken);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiLogout(refreshToken);
      }
    } catch {
      // Ignore logout errors — always clear local state
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authUser');
      clearAccessCookie();
      setAccessToken(null);
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.replace('/login');
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
