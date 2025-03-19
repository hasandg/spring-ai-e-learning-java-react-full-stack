'use client'

import { Box, Typography } from '@mui/material'

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: '#f5f5f5' }}>
        {children}
      </Box>
      
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', 
          backgroundColor: 'white',
          borderTop: '1px solid #e0e0e0'
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} E-Learning Platform. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
} 