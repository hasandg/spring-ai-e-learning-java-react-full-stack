import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

type LogoProps = {
  variant?: 'full' | 'compact';
  size?: 'small' | 'medium' | 'large';
};

export default function Logo({ variant = 'full', size = 'medium' }: LogoProps) {
  const theme = useTheme();
  
  // Size mappings
  const getSvgSize = () => {
    switch (size) {
      case 'small': return { width: 30, height: 30 };
      case 'medium': return { width: 40, height: 40 };
      case 'large': return { width: 50, height: 50 };
      default: return { width: 40, height: 40 };
    }
  };
  
  const getFontSize = () => {
    switch (size) {
      case 'small': return { main: '1.2rem', sub: '0.7rem' };
      case 'medium': return { main: '1.5rem', sub: '0.8rem' };
      case 'large': return { main: '1.8rem', sub: '0.9rem' };
      default: return { main: '1.5rem', sub: '0.8rem' };
    }
  };
  
  const { width, height } = getSvgSize();
  const fontSize = getFontSize();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        cursor: 'pointer'
      }}
    >
      {/* Modern abstract book/monitor icon */}
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.palette.primary.light} />
            <stop offset="100%" stopColor={theme.palette.primary.dark} />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>
        
        {/* Screen/book background */}
        <rect x="15" y="10" width="70" height="60" rx="4" fill="url(#logoGradient)" filter="url(#shadow)" />
        
        {/* Screen inner area */}
        <rect x="20" y="15" width="60" height="45" rx="2" fill="white" fillOpacity="0.9" />
        
        {/* Abstract learning lines */}
        <path d="M30 30 H70" stroke={theme.palette.secondary.main} strokeWidth="3" strokeLinecap="round" />
        <path d="M30 40 H60" stroke={theme.palette.secondary.main} strokeWidth="3" strokeLinecap="round" />
        <path d="M30 50 H50" stroke={theme.palette.secondary.main} strokeWidth="3" strokeLinecap="round" />
        
        {/* Base/stand */}
        <path d="M40 70 H60 L55 90 H45 Z" fill="url(#logoGradient)" filter="url(#shadow)" />
      </svg>
      
      {variant === 'full' && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="h6" 
            component="span" 
            sx={{ 
              fontWeight: 700, 
              fontSize: fontSize.main,
              lineHeight: 1.1,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px'
            }}
          >
            E-Learning
          </Typography>
          <Typography 
            variant="subtitle2" 
            component="span" 
            sx={{ 
              fontSize: fontSize.sub,
              letterSpacing: '1px',
              color: theme.palette.text.secondary,
              textTransform: 'uppercase'
            }}
          >
            Platform
          </Typography>
        </Box>
      )}
    </Box>
  );
} 