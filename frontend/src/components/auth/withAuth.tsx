import React from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { CircularProgress, Box } from '@mui/material';

interface WithAuthOptions {
  roles?: string[];
  redirectTo?: string;
}

export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) => {
  return function WithAuthComponent(props: P) {
    const { isAuthorized, isLoading } = useProtectedRoute(options);

    if (isLoading) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (!isAuthorized) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}; 