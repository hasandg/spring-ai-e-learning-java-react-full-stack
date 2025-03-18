import React from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const examples = [
  {
    title: 'PDF Viewer',
    description: 'Example showing how to view and interact with PDF documents',
    path: '/examples/pdf-viewer'
  },
  {
    title: 'Charts',
    description: 'Various chart types implemented with Chart.js',
    path: '/examples/charts'
  },
  {
    title: 'Drag and Drop',
    description: 'Task manager with drag and drop reordering',
    path: '/examples/drag-and-drop'
  }
];

export default function ExamplesIndex() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Advanced UI Examples
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        This page contains examples of advanced UI components and features implemented in the frontend project.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {examples.map((example) => (
          <Grid item xs={12} sm={6} md={4} key={example.path}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <Typography variant="h6" gutterBottom>
                {example.title}
              </Typography>
              <Typography variant="body2" paragraph sx={{ flexGrow: 1 }}>
                {example.description}
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate(example.path)}
                fullWidth
              >
                View Example
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 