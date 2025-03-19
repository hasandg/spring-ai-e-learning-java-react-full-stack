'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Alert,
  CircularProgress,
  Paper
} from '@mui/material'
import Logo from '@/components/Logo'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null as string | null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      // Get Keycloak configuration
      const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8090'
      const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'elearning'
      const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'frontend'
      
      // Call the Keycloak reset password endpoint
      const resetPasswordEndpoint = `${keycloakUrl}/realms/${realm}/login-actions/reset-credentials`
      
      // Create form data for the request
      const formData = new URLSearchParams()
      formData.append('email', email)
      formData.append('client_id', clientId)
      
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          keycloakUrl,
          realm,
          clientId
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to reset password')
      }
      
      setSuccess(true)
    } catch (error: any) {
      setError(error?.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChange = (e: { target: { value: string } }) => {
    setEmail(e.target.value)
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
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: 2,
          maxWidth: 400,
          width: '100%'
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Logo size="large" />
        </Box>
        
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
          Forgot Password
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            If an account with that email exists, we've sent password reset instructions to your email.
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
            disabled={loading || success}
            autoFocus
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || success || !email}
          >
            {loading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
          
          <Box sx={{ 
            mt: 2, 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Link href="/login" passHref>
              <Typography 
                component="span" 
                variant="body2" 
                sx={{ 
                  color: 'primary.main', 
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Back to Login
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
} 