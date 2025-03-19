'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { authService, UserProfile } from '@/services/authService';

interface AuthContextProps {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        // First check if we have a token
        const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
        const isAuth = !!token;
        
        console.log('[AuthContext] Token exists:', isAuth);
        setIsAuthenticated(isAuth);

        if (isAuth) {
          try {
            // Try to get stored user data first
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              console.log('[AuthContext] Found stored user data');
              setUser(JSON.parse(storedUser));
            } else {
              console.log('[AuthContext] No stored user data found');
            }
          } catch (e) {
            console.error('[AuthContext] Error loading stored user data:', e);
            // Continue even if we can't load the stored user
          }
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('[AuthContext] Auth check error:', e);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // This login method is only used by components that directly use AuthContext
  // The login page uses its own direct implementation
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[AuthContext] Login method called - note: login page uses its own implementation');
      await authService.login(username, password);
      
      // Get user profile after successful login
      try {
        const profile = await authService.getUserProfile();
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      } catch (profileError) {
        console.error('[AuthContext] Profile fetch error:', profileError);
        // Continue even if profile fetch fails
      }
      
      setIsAuthenticated(true);
      
      // Don't use router.push here, it's duplicating the redirect
      // from the login page and causing issues
    } catch (e) {
      console.error('[AuthContext] Login error:', e);
      setError(e instanceof Error ? e.message : 'Login failed');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear all tokens and user data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 