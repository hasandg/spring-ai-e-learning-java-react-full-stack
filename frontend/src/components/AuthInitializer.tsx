'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { setAuth } from '@/store/slices/authSlice'
import { authService } from '@/services/authService'

export default function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Initialize auth state from localStorage and authService
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        
        if (token) {
          try {
            // Fetch user profile with token
            const userProfile = await authService.getUserProfile();
            
            dispatch(setAuth({
              token,
              user: userProfile,
              isAuthenticated: true
            }));
            
            console.log('Auth initialized from local storage');
          } catch (error) {
            console.error('Error initializing auth from token:', error);
            // Clear invalid tokens
            await authService.logout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
      }
    };
    
    initializeAuth();
  }, [dispatch]);

  // This component doesn't render anything
  return null;
} 