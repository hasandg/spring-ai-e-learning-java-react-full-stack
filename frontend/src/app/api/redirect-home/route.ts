import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { token, refreshToken } = await request.json();
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Token is required'
      }, { status: 400 });
    }
    
    console.log('[API] Setting cookies and redirecting to home page');
    
    // Create a response
    const response = NextResponse.json(
      { success: true, message: 'Redirecting to home page' },
      { status: 200 }
    );
    
    // Set token as HTTP-only cookies
    response.cookies.set({
      name: 'token',
      value: token,
      path: '/',
      httpOnly: true,
      maxAge: 3600, // 1 hour
      sameSite: 'lax',
    });
    
    if (refreshToken) {
      response.cookies.set({
        name: 'refresh_token',
        value: refreshToken,
        path: '/',
        httpOnly: true,
        maxAge: 86400, // 24 hours
        sameSite: 'lax',
      });
    }
    
    response.headers.set('Location', '/');
    
    return response;
  } catch (error) {
    console.error('[API] Redirect error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to set cookies and redirect',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 