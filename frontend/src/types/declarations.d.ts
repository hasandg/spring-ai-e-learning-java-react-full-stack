// This file contains type declarations for external modules that don't have types

// External modules
declare module 'usehooks-ts';
declare module '@hookform/resolvers/yup';
declare module 'redux-logger';
declare module 'match-sorter';
declare module '@stomp/stompjs';
declare module 'notistack';
declare module 'react-pdf';
declare module 'react-pdf/dist/esm/entry.webpack';
declare module 'chart.js';
declare module 'react-chartjs-2';
declare module 'react-dnd';
declare module 'react-dnd-html5-backend';
declare module 'keycloak-js';

// React and Material UI components
declare module 'react';
declare module 'react-dom/client';
declare module 'react-router-dom';
declare module '@mui/material';
declare module '@mui/material/styles';
declare module '@mui/material/CssBaseline';
declare module '@mui/icons-material/*';

// Internal modules (using path aliases)
declare module '@/services/*';
declare module '@/hooks/*';
declare module '@/components/*';
declare module '@/contexts/*';
declare module '@/store';
declare module '@/theme';

// Node.js environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    [key: string]: string | undefined;
  }
} 