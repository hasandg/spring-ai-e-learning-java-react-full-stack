import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Username and password are required'
      }, { status: 400 });
    }
    
    // Get Keycloak configuration
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8090';
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'elearning';
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'frontend';
    
    console.log(`[API] Testing direct login for user: ${username}`);
    
    // Create token endpoint URL
    const tokenEndpoint = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`;
    
    // Create form data for token request
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('client_id', clientId);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('scope', 'openid profile email');
    
    // Make token request
    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });
    
    // Check token response status
    console.log(`[API] Token response status: ${tokenResponse.status}`);
    
    const responseText = await tokenResponse.text();
    
    // Determine response type and parse accordingly
    let parsedResponse;
    let responseType = 'unknown';
    
    if (responseText.startsWith('{') || responseText.startsWith('[')) {
      try {
        parsedResponse = JSON.parse(responseText);
        responseType = 'json';
      } catch (e) {
        responseType = 'invalid-json';
        parsedResponse = { text: responseText.substring(0, 500) };
      }
    } else if (responseText.startsWith('<!DOCTYPE') || responseText.startsWith('<html')) {
      responseType = 'html';
      parsedResponse = { html: responseText.substring(0, 500) };
    } else {
      responseType = 'text';
      parsedResponse = { text: responseText.substring(0, 500) };
    }
    
    // Prepare the response
    const result = {
      success: tokenResponse.ok,
      status: tokenResponse.status,
      statusText: tokenResponse.statusText,
      responseType,
      headers: Object.fromEntries(tokenResponse.headers.entries()),
      response: parsedResponse,
      keycloakUrl,
      realm,
      clientId,
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(result, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error) {
    console.error('[API] Direct login test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Direct login test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 