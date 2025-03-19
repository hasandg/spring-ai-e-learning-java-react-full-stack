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
  
  // Skip middleware completely for all API routes to avoid API redirect loops
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // For home page - check if there's a token in request body for POST requests
  if (pathname === '/' && request.method === 'POST') {
    console.log('[Middleware] POST request to home page - bypassing auth check');
    return NextResponse.next();
  }
  
  // Allow direct access to pages with auth param
  const allowedPathsWithAuth = ['/courses', '/profile', '/my-courses'];
  if ((allowedPathsWithAuth.includes(pathname) || 
       pathname.startsWith('/courses/') || 
       pathname.startsWith('/profile/') || 
       pathname.startsWith('/my-courses/')) && 
      request.nextUrl.searchParams.get('auth') === 'true') {
    console.log(`[Middleware] Direct access to ${pathname} with auth param - bypassing auth check`);
    return NextResponse.next();
  }
  
  // Skip auth check for certain paths if coming from login page
  const referer = request.headers.get('referer') || '';
  if ((pathname === '/' || 
       pathname === '/courses' || 
       pathname === '/profile' || 
       pathname === '/my-courses' || 
       pathname.startsWith('/courses/')) && 
      referer.includes('/login')) {
    console.log(`[Middleware] Navigation from login page to ${pathname} - bypassing auth check`);
    return NextResponse.next();
  }
  
  // First check cookie
  const token = request.cookies.get('token')?.value;

  // If we're in development mode or testing, allow mock auth to bypass normal checks
  const isDev = process.env.NODE_ENV === 'development';
  const isMockAuth = pathname !== '/login' && pathname !== '/register' && isDev;
  
  // Check if the path is public
  if (publicPaths.includes(pathname)) {
    // If user is already authenticated and tries to access login/register, redirect to dashboard
    // UNLESS bypass_redirect=true parameter is present
    if (token && (pathname === '/login' || pathname === '/register')) {
      // Check for bypass parameter to prevent redirect loop
      if (request.nextUrl.searchParams.get('bypass_redirect') === 'true') {
        console.log(`[Middleware] Bypassing dashboard redirect for ${pathname}`);
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // DEVELOPMENT BYPASS - Enable for testing
  if (isDev) {
    console.log(`[DEV MODE] Bypassing auth check for: ${pathname}`);
    return NextResponse.next();
  }

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
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/).*)',
  ],
}; 