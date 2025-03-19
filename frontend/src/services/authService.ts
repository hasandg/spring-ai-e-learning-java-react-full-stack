// Create a simpler auth service that doesn't rely on Keycloak.js
// and handles direct token requests

const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8090';
const REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'elearning';
const CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'frontend';

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
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
  /**
   * Authenticate user directly using the token endpoint
   */
  login: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const tokenEndpoint = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;
      
      // Create form data for direct token request
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('client_id', CLIENT_ID);
      formData.append('username', username);
      formData.append('password', password);
      formData.append('scope', 'openid profile email');
      
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error_description || 'Failed to authenticate');
      }
      
      const data = await response.json();
      
      // Store tokens in localStorage
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      
      return {
        token: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        tokenType: data.token_type,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Logout the user by clearing tokens
   */
  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    
    // Redirect to login
    window.location.href = '/login';
  },

  /**
   * Get the user profile using the userinfo endpoint
   */
  getUserProfile: async (): Promise<UserProfile> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const userInfoEndpoint = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/userinfo`;
      
      console.log('Fetching user profile with token:', token.substring(0, 10) + '...');
      
      const response = await fetch(userInfoEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('User info fetch failed:', response.status, errorText);
        throw new Error(`Failed to retrieve user profile: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('User info response:', data);
      
      return {
        id: data.sub || '',
        username: data.preferred_username || '',
        email: data.email || '',
        firstName: data.given_name || '',
        lastName: data.family_name || '',
        roles: data.realm_access?.roles || [],
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },

  /**
   * Check if the user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Get the current token
   */
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  /**
   * Refresh the token
   */
  refreshToken: async (): Promise<AuthResponse> => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }
      
      const tokenEndpoint = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;
      
      const formData = new URLSearchParams();
      formData.append('grant_type', 'refresh_token');
      formData.append('client_id', CLIENT_ID);
      formData.append('refresh_token', refreshToken);
      
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      const data = await response.json();
      
      // Update tokens in localStorage
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      
      return {
        token: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        tokenType: data.token_type,
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },

  /**
   * Check if token is valid
   */
  hasValidToken: (): boolean => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },
}; 