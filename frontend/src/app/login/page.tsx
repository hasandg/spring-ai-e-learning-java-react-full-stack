'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Alert,
  CircularProgress
} from '@mui/material'
import Logo from '@/components/Logo'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [username, setUsername] = useState('test')
  const [password, setPassword] = useState('Test@Pass123')

  const handleDirectLogin = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Get Keycloak configuration
      const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8090'
      const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'elearning'
      const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'frontend'
      
      // Direct token endpoint call
      const tokenEndpoint = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`
      
      // Create form data for direct token request
      const formData = new URLSearchParams()
      formData.append('grant_type', 'password')
      formData.append('client_id', clientId)
      formData.append('username', username)
      formData.append('password', password)
      formData.append('scope', 'openid profile email')
      
      // Use more robust fetch with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      try {
        const response = await fetch(tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: formData.toString(),
          signal: controller.signal,
          mode: 'cors',
          credentials: 'include',
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          const errorText = await response.text()
          try {
            const errorData = JSON.parse(errorText)
            throw new Error(errorData.error_description || `Authentication failed (${response.status})`)
          } catch (parseError) {
            throw new Error(`Authentication failed (${response.status}): ${errorText.substring(0, 100)}`)
          }
        }
        
        // Try to parse the response
        let data
        try {
          const responseText = await response.text()
          data = JSON.parse(responseText)
        } catch (parseError) {
          throw new Error('Invalid token response format')
        }
        
        if (!data.access_token) {
          throw new Error('Invalid token response: No access token received')
        }
        
        // Store all tokens
        localStorage.setItem('auth_token', data.access_token)
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        localStorage.setItem('refreshToken', data.refresh_token)
        localStorage.setItem('isAuthenticated', 'true')
        
        // Basic user info
        const userInfo = {
          username: username,
          roles: ['USER']
        }
        localStorage.setItem('user', JSON.stringify(userInfo))
        
        // Try to fetch the complete user profile
        try {
          const userInfoEndpoint = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/userinfo`
          
          const profileResponse = await fetch(userInfoEndpoint, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${data.access_token}`,
              'Accept': 'application/json'
            },
            mode: 'cors',
          })
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json()
            
            const completeUserInfo = {
              id: profileData.sub || '',
              username: profileData.preferred_username || username,
              email: profileData.email || '',
              firstName: profileData.given_name || '',
              lastName: profileData.family_name || '',
              roles: profileData.realm_access?.roles || ['USER']
            }
            
            localStorage.setItem('user', JSON.stringify(completeUserInfo))
          }
        } catch (profileError) {
          // Continue even if profile fetch fails
        }
        
        // Automatically redirect to courses page
        window.location.href = '/courses?from=login&auth=true';
      } catch (fetchError: any) {
        // Network error or timeout
        if (fetchError.name === 'AbortError') {
          throw new Error('Login request timed out. Please try again.')
        } else {
          throw new Error(`Network error: ${fetchError.message}`)
        }
      }
      
    } catch (error: any) {
      setError(error instanceof Error ? error.message : 'Login failed. Please check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
        backgroundColor: '#f5f5f5'
      }}
    >
      <Box 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 400,
          width: '100%'
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Logo size="large" />
        </Box>
        
        <Typography variant="h5" component="h2" gutterBottom>
          Login
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleDirectLogin} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e: any) => setUsername(e.target.value)}
            disabled={loading}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            disabled={loading}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          
          <Box sx={{ 
            mt: 2, 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Don't have an account?
            </Typography>
            <Link href="/register" passHref>
              <Typography 
                component="span" 
                variant="body2" 
                sx={{ 
                  color: 'primary.main', 
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Register
              </Typography>
            </Link>
          </Box>
          
          <Box sx={{ 
            mt: 1, 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Link href="/forgot-password" passHref>
              <Typography 
                component="span" 
                variant="body2" 
                sx={{ 
                  color: 'primary.main', 
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Forgot Password?
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
} 