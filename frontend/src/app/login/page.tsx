'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { authService } from '@/services/authService'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { setAuth } from '@/store/slices/authSlice'

const LoginPage = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null as string | null)
  const [success, setSuccess] = useState(null as string | null)
  const [debugInfo, setDebugInfo] = useState({})

  // Auto-debug on mount
  useEffect(() => {
    console.log("=== LOGIN PAGE MOUNTED - DIRECT KEYCLOAK AUTHENTICATION ===");
    const initAuth = async () => {
      try {
        console.log("Checking Keycloak connection...");
        
        try {
          const isInitialized = await authService.initKeycloak();
          console.log("✅ Keycloak initialized:", isInitialized);
          setDebugInfo((prev: any) => ({ ...prev, keycloakInitialized: isInitialized }));
          
          if (isInitialized && authService.isAuthenticated()) {
            const userProfile = await authService.getUserProfile();
            console.log("✅ User is already authenticated:", userProfile);
            setDebugInfo((prev: any) => ({ 
              ...prev, 
              isAuthenticated: true,
              userProfile
            }));
            // Redirect to dashboard if already logged in
            router.push('/');
          }
        } catch (keycloakError) {
          console.error("❌ Keycloak initialization error:", keycloakError);
          setDebugInfo((prev: any) => ({ 
            ...prev, 
            keycloakInitialized: false,
            keycloakError
          }));
        }
      } catch (e) {
        console.error("Auto-debug error:", e);
        setDebugInfo((prev: any) => ({ ...prev, autoDebugError: e }));
      }
    };
    
    // Run the debug after a short delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      initAuth();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [router]);

  const validationSchema = Yup.object({
    email: Yup.string().required('Kullanıcı adı veya e-posta adresi zorunludur'),
    password: Yup.string().required('Şifre zorunludur')
  })

  const formik = useFormik({
    initialValues: {
      email: 'test',
      password: 'testpass123'
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('Login attempt with:', values.email);
        
        // Extract username from email (part before @)
        const username = values.email.includes('@') ? values.email.split('@')[0] : values.email;
        
        // Instead of redirecting to Keycloak, use a direct token API
        try {
          // This would be your backend API endpoint that handles token exchange
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username, // Send the extracted username
              email: values.email, // Send the full email
              password: values.password,
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
          }
          
          const data = await response.json();
          console.log('Login successful, token received');
          
          // Show success
          setSuccess('Login successful! Redirecting to dashboard...');
          
          // Store tokens (this should match your auth service implementation)
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('refresh_token', data.refreshToken);
          
          // Also set the token as a cookie for middleware
          document.cookie = `token=${data.token}; path=/; max-age=${data.expiresIn}`;
          
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          
          // Update Redux state
          dispatch(setAuth({
            token: data.token,
            user: data.user,
            isAuthenticated: true
          }));
          
          // Redirect to dashboard
          console.log('Setting up redirect timeout...');
          setTimeout(() => {
            console.log('Redirect timeout triggered, redirecting now...');
            window.location.href = 'http://localhost:3000/';
          }, 2000);
        } catch (err) {
          console.error('Login API error:', err);
          throw err;
        }
      } catch (error: any) {
        console.error('Login error:', error)
        setError(error?.message || 'Login failed. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  })

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 2
      }}
    >
      <Card sx={{ maxWidth: 450, width: '100%', boxShadow: 3 }}>
        <CardContent sx={{ padding: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
            Giriş Yap
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Kullanıcı Adı veya E-posta"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
              variant="outlined"
            />
            
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Şifre"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
              variant="outlined"
              sx={{ mb: 3 }}
            />
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'LOGIN'}
            </Button>
          </form>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Hesabınız yok mu? <Link href="/register">Kayıt Ol</Link>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <Link href="/reset-password">Şifremi Unuttum</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginPage 