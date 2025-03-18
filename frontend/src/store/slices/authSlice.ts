import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '@/services/authService'
import { RootState } from '../store'

// Always use real authService
const service = authService;

interface AuthState {
  user: any | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const initAuth = createAsyncThunk(
  'auth/init',
  async (_, { rejectWithValue }) => {
    try {
      const authenticated = await service.initKeycloak()
      
      if (authenticated) {
        const profile = await service.getUserProfile()
        const token = service.getToken() || null
        
        return {
          user: profile,
          token,
          isAuthenticated: true
        }
      }
      
      return {
        user: null,
        token: null,
        isAuthenticated: false
      }
    } catch (error: any) {
      console.error('Init auth error:', error)
      return rejectWithValue(error.message || 'Failed to initialize authentication')
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (_, { rejectWithValue }) => {
    try {
      console.log('AUTH SLICE: Initiating Keycloak login');
      
      // With Keycloak, we don't need to pass credentials as it will redirect to the Keycloak login page
      await service.login();
      
      // Note: The code below won't be reached immediately as the browser will be redirected to Keycloak
      console.log('AUTH SLICE: Login function completed - this should only appear after redirect back from Keycloak');
      return null;
    } catch (error: any) {
      console.error('AUTH SLICE: Login error in thunk:', error);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await service.logout()
      // This will redirect to logout, so we won't reach the return statement
      return null
    } catch (error: any) {
      console.error('Logout error:', error)
      return rejectWithValue(error.message || 'Logout failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setAuth: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = action.payload.isAuthenticated
    },
    // Direct login without using any services - for testing only
    directLogin: (state, action) => {
      console.log('DIRECT LOGIN: Bypassing all services');
      
      // Generate mock token
      const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2, 15);
      
      // Set authentication state directly
      state.user = {
        username: action.payload?.username || 'testuser',
        email: action.payload?.email || 'test@example.com',
        roles: ['user']
      };
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      
      // Also store token in localStorage for middleware checks
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Suggest setting a cookie
        console.log('DIRECT LOGIN: For middleware support, set a cookie with:');
        console.log(`document.cookie = "token=${token}; path=/; SameSite=Lax";`);
      }
      
      console.log('DIRECT LOGIN: Authentication state set directly and stored in localStorage');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initAuth.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = action.payload.isAuthenticated
      })
      .addCase(initAuth.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state) => {
        // With Keycloak, we don't update state here because the redirect happens
        // The real state update will happen after the redirect back via initAuth
        state.loading = false
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  }
})

export const { clearError, setAuth, directLogin } = authSlice.actions

export const selectUser = (state: RootState) => state.auth.user
export const selectToken = (state: RootState) => state.auth.token
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectAuthLoading = (state: RootState) => state.auth.loading
export const selectAuthError = (state: RootState) => state.auth.error

export default authSlice.reducer 