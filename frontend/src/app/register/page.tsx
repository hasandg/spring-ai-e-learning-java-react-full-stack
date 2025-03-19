'use client'

import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Strong@Password123',
      role: 'USER',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required('First name is required'),
      lastName: Yup.string()
        .required('Last name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .max(40, 'Password must be at most 40 characters')
        .required('Password is required'),
      role: Yup.string()
        .required('Role is required'),
    }),
    onSubmit: async (values) => {
      try {
        setError('')
        setSuccess('')
        setLoading(true)
        
        console.log('Registration data:', values);
        
        // Extract username from email
        const username = values.email.includes('@') ? values.email.split('@')[0] : values.email;
        
        // Instead of redirecting to Keycloak, call a backend API
        try {
          // This would be your backend API endpoint that creates a user in Keycloak
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...values,
              username,
              roles: [values.role]
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
          }
          
          const data = await response.json();
          console.log('Registration successful:', data);
          
          // Show success message
          setSuccess('Registration successful! You will be redirected to the login page in a moment.');
          
          // Redirect to login after a short delay
          setTimeout(() => {
            router.push(`/login?registered=true&email=${encodeURIComponent(values.email)}`);
          }, 1500);
        } catch (err) {
          console.error('Registration API error:', err);
          throw err;
        }
      } catch (err: any) {
        console.error('Registration error:', err);
        setError(err.message || 'Failed to register. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh',
      background: 'white',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'white',
        zIndex: 0
      }
    }}>
      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 5 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mt: 8, 
            position: 'relative',
            zIndex: 10,
            backgroundColor: 'white',
            color: 'black',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Logo size="large" />
          </Box>
          
          <Typography component="h1" variant="h5" align="center" sx={{ color: 'black' }}>
            Sign up
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%', zIndex: 20 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2, width: '100%', zIndex: 20 }}>
              {success}
            </Alert>
          )}
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3, position: 'relative', zIndex: 20 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  InputLabelProps={{
                    shrink: true,
                    sx: { color: 'text.secondary' }
                  }}
                  InputProps={{
                    sx: { color: 'black' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  InputLabelProps={{
                    shrink: true,
                    sx: { color: 'text.secondary' }
                  }}
                  InputProps={{
                    sx: { color: 'black' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputLabelProps={{
                    shrink: true,
                    sx: { color: 'text.secondary' }
                  }}
                  InputProps={{
                    sx: { color: 'black' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputLabelProps={{
                    shrink: true,
                    sx: { color: 'text.secondary' }
                  }}
                  InputProps={{
                    sx: { color: 'black' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="role-label" sx={{ color: 'text.secondary' }}>Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    sx={{ color: 'black' }}
                    label="Role"
                  >
                    <MenuItem value="USER">User</MenuItem>
                    <MenuItem value="INSTRUCTOR">Instructor</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/login" passHref>
                  <Typography component="span" variant="body2" sx={{ color: 'primary.main', textDecoration: 'underline', cursor: 'pointer' }}>
                    Already have an account? Sign in
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
} 