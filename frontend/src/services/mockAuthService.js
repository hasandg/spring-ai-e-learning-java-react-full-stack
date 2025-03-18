// Mock authentication service for testing
// This service simulates API calls without actually making network requests

// In-memory user storage
let users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    roles: ['ADMIN']
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    password: 'password123',
    firstName: 'Regular',
    lastName: 'User',
    roles: ['USER']
  }
];

// For debugging: print all registered users
const printUsers = () => {
  console.log('Current registered users:', users.map(u => ({ email: u.email, username: u.username })));
};

// Mock delay to simulate network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  // Login user
  login: async (credentials) => {
    console.log('Mock login attempt with:', credentials);
    printUsers(); // Debug: print all users
    await delay(500); // Simulate API delay
    
    const user = users.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password
    );
    
    if (!user) {
      console.error('Login failed: user not found or password mismatch');
      const error = new Error('Invalid credentials');
      error.response = { 
        data: { message: 'Invalid email or password' } 
      };
      throw error;
    }
    
    console.log('Login successful for user:', user.email);
    const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
    
    // Store in localStorage to simulate real auth
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles
    }));
    
    return {
      token,
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles
    };
  },

  // Register user
  register: async (userData) => {
    console.log('Mock register attempt with:', userData);
    printUsers(); // Debug: print all users before registration
    await delay(500); // Simulate API delay
    
    // Case-insensitive email check
    const emailExists = users.some(u => 
      u.email.toLowerCase() === userData.email.toLowerCase()
    );
    
    if (emailExists) {
      console.error('Registration failed: email already exists:', userData.email);
      const error = new Error('Email already in use');
      error.response = { 
        data: { message: 'Email is already registered' } 
      };
      throw error;
    }
    
    // Password validation - allow shorter passwords
    if (typeof userData.password !== 'string' || userData.password.length < 1) {
      console.error('Registration failed: invalid password');
      const error = new Error('Invalid password');
      error.response = { 
        data: { message: 'Password is required' } 
      };
      throw error;
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      ...userData,
      roles: userData.roles || ['USER']
    };
    
    users.push(newUser);
    console.log('Registration successful for:', newUser.email);
    printUsers(); // Debug: print all users after registration
    
    return {
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        roles: newUser.roles
      }
    };
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  // For testing purposes: reset users to initial state
  resetUsers: () => {
    users = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        roles: ['ADMIN']
      },
      {
        id: 2,
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123',
        firstName: 'Regular',
        lastName: 'User',
        roles: ['USER']
      }
    ];
    console.log('Users reset to default');
    return true;
  }
};

// Also export as default
export default mockAuthService; 