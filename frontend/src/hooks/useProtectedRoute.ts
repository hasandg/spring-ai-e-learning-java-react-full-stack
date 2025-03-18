import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

interface UseProtectedRouteOptions {
  roles?: string[];
  redirectTo?: string;
}

export const useProtectedRoute = ({
  roles = [],
  redirectTo = '/login',
}: UseProtectedRouteOptions = {}) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Store the current path to redirect back after login
        router.push({
          pathname: redirectTo,
          query: { from: router.pathname },
        });
        return;
      }

      // Check if user has required role
      if (roles.length > 0 && !roles.includes(user.role)) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, roles, router, redirectTo]);

  return {
    isAuthorized: user && (roles.length === 0 || roles.includes(user.role)),
    isLoading: loading,
  };
}; 