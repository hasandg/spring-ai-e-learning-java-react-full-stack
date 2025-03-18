import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTokenExpired, getTokenRole } from '@/utils/jwt';

// Add paths that don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/reset-password',
  '/api/auth/reset-password/confirm',
  '/api/auth/refresh',
];

// Add paths that require specific roles
const roleProtectedPaths = {
  '/admin': ['admin'],
  '/instructor': ['admin', 'instructor'],
  '/student': ['admin', 'instructor', 'student'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // First check cookie
  const token = request.cookies.get('token')?.value;

  // If we're in development mode or testing, allow mock auth to bypass normal checks
  const isDev = process.env.NODE_ENV === 'development';
  const isMockAuth = pathname !== '/login' && pathname !== '/register' && isDev;
  
  // Check if the path is public
  if (publicPaths.includes(pathname)) {
    // If user is already authenticated and tries to access login/register, redirect to dashboard
    if (token && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // DEVELOPMENT BYPASS REMOVED - We now apply authentication checks in all environments
  // Only uncomment if you need to bypass for testing specific features
  // if (isDev) {
  //   console.log(`[DEV MODE] Bypassing auth check for: ${pathname}`);
  //   return NextResponse.next();
  // }

  // Check if the path requires authentication
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if token is expired
  if (isTokenExpired(token)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if the path requires specific roles
  for (const [path, roles] of Object.entries(roleProtectedPaths)) {
    if (pathname.startsWith(path)) {
      const userRole = getTokenRole(token);
      
      if (!userRole || !roles.includes(userRole)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 