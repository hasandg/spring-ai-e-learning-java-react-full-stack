import React from 'react';
import { Box, Typography } from '@mui/material';

export default function ExamplesIndex() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Advanced UI Examples
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        The example components have been removed as they were not being used in the application.
      </Typography>
    </Box>
  );
} 