'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Alert } from '@mui/material';

export default function AuthTestPage() {
  const [authState, setAuthState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication state on component mount
    checkAuthState();
  }, []);

  const checkAuthState = () => {
    try {
      setLoading(true);
      
      // Get tokens from localStorage
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('refreshToken') || localStorage.getItem('refresh_token');
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const userJson = localStorage.getItem('user');
      let user = null;
      
      try {
        user = userJson ? JSON.parse(userJson) : null;
      } catch (e) {
        console.error('Failed to parse user JSON:', e);
      }
      
      // Create auth state object
      const state = {
        isAuthenticated,
        hasToken: !!token,
        tokenLength: token?.length || 0,
        hasRefreshToken: !!refreshToken,
        refreshTokenLength: refreshToken?.length || 0,
        user,
        timestamp: new Date().toISOString()
      };
      
      setAuthState(state);
      setError(null);
    } catch (e) {
      console.error('Error checking auth state:', e);
      setError('Failed to check auth state: ' + (e instanceof Error ? e.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      
      alert('Authentication data cleared');
      checkAuthState();
    } catch (e) {
      console.error('Error clearing auth state:', e);
      setError('Failed to clear auth state: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Authentication Test Page
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Button 
        variant="contained" 
        onClick={checkAuthState} 
        sx={{ mr: 2, mb: 2 }}
      >
        Refresh Auth State
      </Button>
      
      <Button 
        variant="outlined" 
        onClick={clearAuth}
        color="error"
        sx={{ mr: 2, mb: 2 }}
      >
        Clear Auth Data
      </Button>
      
      <Button 
        variant="outlined" 
        onClick={() => window.location.href = '/login'}
        sx={{ mb: 2 }}
      >
        Go to Login
      </Button>
      
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Authentication State:
        </Typography>
        
        {loading ? (
          <Typography>Loading...</Typography>
        ) : authState ? (
          <Box component="pre" sx={{ 
            p: 2, 
            bgcolor: '#f5f5f5', 
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(authState, null, 2)}
          </Box>
        ) : (
          <Typography>No authentication state found</Typography>
        )}
      </Paper>
    </Box>
  );
} 