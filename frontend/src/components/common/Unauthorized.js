import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Unauthorized = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 5, mt: 8, textAlign: 'center' }}>
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        
        <Typography variant="body1" paragraph>
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </Typography>
        
        <Box mt={4}>
          <Button 
            component={Link} 
            to="/dashboard" 
            variant="contained" 
            color="primary" 
            sx={{ mr: 2 }}
          >
            Go to Dashboard
          </Button>
          
          <Button 
            component={Link} 
            to="/" 
            variant="outlined"
          >
            Go to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Unauthorized; 