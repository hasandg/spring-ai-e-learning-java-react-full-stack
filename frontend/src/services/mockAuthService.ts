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

// Mock token that expires in 1 hour
const generateMockToken = () => {
  return 'mock-jwt-token-' + Math.random().toString(36).substring(2, 15);
};

export const mockAuthService = {
  initKeycloak: async (): Promise<boolean> => {
    console.log('Mock Keycloak initialized');
    return true;
  },
  
  login: async (credentials?: { username?: string; password?: string; email?: string }): Promise<AuthResponse> => {
    console.log('Mock login with credentials:', credentials);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // ALWAYS succeed, regardless of credentials
    console.log('Mock login ALWAYS succeeds');
    
    const username = credentials?.username || 'mockuser';
    const email = credentials?.email || 'mockuser@example.com';
    
    return {
      token: generateMockToken(),
      refreshToken: generateMockToken(),
      idToken: generateMockToken(),
      username,
      email,
      roles: ['user'],
      tokenParsed: {
        preferred_username: username,
        email,
        given_name: 'Mock',
        family_name: 'User',
        exp: Math.floor(Date.now() / 1000) + 3600,
      }
    };
  },
  
  logout: async (): Promise<void> => {
    console.log('Mock logout');
    return Promise.resolve();
  },
  
  getToken: (): string => {
    return generateMockToken();
  },
  
  updateToken: async (): Promise<string> => {
    console.log('Mock token refresh');
    return generateMockToken();
  },
  
  isAuthenticated: (): boolean => {
    return true;
  },
  
  hasRole: (role: string): boolean => {
    return role === 'user';
  },
  
  register: async (userData: any): Promise<any> => {
    console.log('Mock register with user data:', userData);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // ALWAYS succeed, regardless of input
    console.log('Mock registration ALWAYS succeeds');
    
    return {
      success: true,
      message: "Registration successful",
      user: {
        id: 'mock-user-id-' + Math.random().toString(36).substring(2, 15),
        username: userData.username || userData.email.split('@')[0],
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        roles: userData.roles || ['USER']
      }
    };
  },
  
  getUserProfile: async (): Promise<UserProfile> => {
    return {
      id: 'mock-user-id',
      username: 'mockuser',
      email: 'mockuser@example.com',
      firstName: 'Mock',
      lastName: 'User',
      roles: ['user']
    };
  }
}; 