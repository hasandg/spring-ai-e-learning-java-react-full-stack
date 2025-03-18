'use client'

import React from 'react'
import { Box } from '@mui/material'
import Navbar from './Navbar'
import Footer from './Footer'
import { usePathname } from 'next/navigation'

const publicRoutes = ['/', '/login', '/register']

export default function ClientProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname()
  
  // Check if the current route is a public route
  const isPublicRoute = publicRoutes.includes(pathname)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
        className="relative"
      >
        {children}
      </Box>
      
      <Footer />
    </Box>
  )
} 