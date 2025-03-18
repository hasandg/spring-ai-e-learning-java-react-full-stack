'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { setAuth } from '@/store/slices/authSlice'

export default function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Initialize auth state from localStorage
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('auth_token')
        const userStr = localStorage.getItem('user')
        
        if (token) {
          const user = userStr ? JSON.parse(userStr) : null
          
          console.log('Initializing auth state from localStorage:', { 
            hasToken: !!token, 
            hasUser: !!user 
          })
          
          dispatch(setAuth({
            token,
            user,
            isAuthenticated: true
          }))
        }
      } catch (error) {
        console.error('Error initializing auth state:', error)
      }
    }
  }, [dispatch])

  // This component doesn't render anything
  return null
} 