import Keycloak, { KeycloakInstance } from 'keycloak-js';

const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8090';
const REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'elearning';
const CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'frontend';
const CLIENT_SECRET = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET || '';

// Initialize Keycloak instance
const keycloakConfig = {
  url: KEYCLOAK_URL,
  realm: REALM,
  clientId: CLIENT_ID
  // Public client doesn't need credentials
};

let keycloak: any = null;

// Only initialize in browser, not during SSR
if (typeof window !== 'undefined') {
  keycloak = new Keycloak(keycloakConfig);
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  idToken: string;
  username: string;
  email: string;
  roles: string[];
  tokenParsed: any;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export const authService = {
  initKeycloak: async (): Promise<boolean> => {
    if (!keycloak) {
      console.error('Keycloak not initialized - client is null');
      return false;
    }
    
    try {
      console.log('Starting Keycloak initialization with config:', keycloakConfig);
      
      const authenticated = await keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256',
        checkLoginIframe: false // Add this to avoid iframe issues
      });
      
      console.log('Keycloak initialized successfully:', 
        authenticated ? 'User is authenticated' : 'User is not authenticated');
      console.log('Keycloak instance:', keycloak);
      return authenticated;
    } catch (error) {
      console.error('Failed to initialize Keycloak. Detailed error:', error);
      console.log('Keycloak config used:', keycloakConfig);
      console.log('Environment variables:', {
        KEYCLOAK_URL,
        REALM,
        CLIENT_ID
      });
      return false;
    }
  },
  
  login: async (): Promise<AuthResponse> => {
    if (!keycloak) {
      console.error('Keycloak not initialized - client is null');
      throw new Error('Keycloak not initialized');
    }
    
    try {
      console.log('Attempting to log in with Keycloak');
      
      // Define login options for better control
      const loginOptions = {
        redirectUri: window.location.origin + '/login',
        prompt: 'login' // Force showing login form even if already authenticated
      };
      
      console.log('Login options:', loginOptions);
      
      // Call the Keycloak login method with options
      await keycloak.login(loginOptions);
      
      // Return a basic response so TypeScript is happy
      // This code likely won't execute due to the redirect
      return {
        token: 'redirecting',
        refreshToken: 'redirecting',
        idToken: 'redirecting',
        username: 'redirecting',
        email: 'redirecting',
        roles: [],
        tokenParsed: {}
      };
    } catch (error) {
      console.error('Login error details:', error);
      throw error;
    }
  },
  
  logout: async (): Promise<void> => {
    if (!keycloak) {
      console.error('Keycloak not initialized');
      return;
    }
    
    try {
      await keycloak.logout();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  getToken: (): string | undefined => {
    return keycloak?.token;
  },
  
  updateToken: async (minValidity = 5): Promise<string> => {
    if (!keycloak) {
      throw new Error('Keycloak not initialized');
    }
    
    try {
      const refreshed = await keycloak.updateToken(minValidity);
      console.log('Token refreshed:', refreshed);
      return keycloak.token || '';
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // Force login when refresh fails
      keycloak.login();
      throw error;
    }
  },
  
  isAuthenticated: (): boolean => {
    return !!keycloak?.authenticated;
  },
  
  hasRole: (role: string): boolean => {
    return keycloak?.hasRealmRole(role) || false;
  },
  
  getUserProfile: async (): Promise<UserProfile> => {
    if (!keycloak) {
      throw new Error('Keycloak not initialized');
    }
    
    try {
      const profile = await keycloak.loadUserProfile();
      const roles = keycloak.realmAccess?.roles || [];
      
      return {
        id: keycloak.subject || '',
        username: profile.username || '',
        email: profile.email || '',
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        roles: roles
      };
    } catch (error) {
      console.error('Failed to load user profile:', error);
      throw error;
    }
  }
}; 