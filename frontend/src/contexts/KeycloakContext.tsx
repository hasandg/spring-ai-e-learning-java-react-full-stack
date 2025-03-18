'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { authService } from '@/services/authService';

export interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: {
    id?: string;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
  } | null;
  error: string | null;
}

interface KeycloakContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  getToken: () => string | undefined;
  updateToken: (minValidity?: number) => Promise<string>;
}

const KeycloakContext = createContext<KeycloakContextType | undefined>(undefined);

interface KeycloakProviderProps {
  children: ReactNode;
}

export const KeycloakProvider = ({ children }: KeycloakProviderProps) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isInitialized: false,
    isLoading: true,
    user: null,
    error: null
  });

  const initialize = async () => {
    try {
      const authenticated = await authService.initKeycloak();
      
      if (authenticated) {
        // User is authenticated, load profile
        const profile = await authService.getUserProfile();
        
        setState({
          isAuthenticated: true,
          isInitialized: true,
          isLoading: false,
          user: {
            id: profile.id,
            username: profile.username,
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            roles: profile.roles
          },
          error: null
        });
      } else {
        // User is not authenticated
        setState({
          isAuthenticated: false,
          isInitialized: true,
          isLoading: false,
          user: null,
          error: null
        });
      }
    } catch (error) {
      console.error('Failed to initialize authentication:', error);
      setState({
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
        user: null,
        error: error instanceof Error ? error.message : 'Failed to initialize authentication'
      });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const login = async () => {
    setState({ ...state, isLoading: true, error: null });
    try {
      await authService.login();
      // Page will redirect and reload after successful login
    } catch (error) {
      console.error('Login error:', error);
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to login'
      });
    }
  };

  const logout = async () => {
    setState({ ...state, isLoading: true });
    try {
      await authService.logout();
      // Page will redirect and reload after logout
    } catch (error) {
      console.error('Logout error:', error);
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to logout'
      });
    }
  };

  const hasRole = (role: string): boolean => {
    return authService.hasRole(role);
  };

  const getToken = (): string | undefined => {
    return authService.getToken();
  };

  const updateToken = async (minValidity = 5): Promise<string> => {
    return authService.updateToken(minValidity);
  };

  return (
    <KeycloakContext.Provider
      value={{
        ...state,
        login,
        logout,
        hasRole,
        getToken,
        updateToken
      }}
    >
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = (): KeycloakContextType => {
  const context = useContext(KeycloakContext);
  if (context === undefined) {
    throw new Error('useKeycloak must be used within a KeycloakProvider');
  }
  return context;
};

export default KeycloakContext; 