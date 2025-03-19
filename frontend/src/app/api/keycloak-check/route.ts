import { NextResponse } from 'next/server';

export async function GET() {
  const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8090';
  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'elearning';
  
  try {
    console.log('[API] Checking Keycloak connectivity at:', keycloakUrl);
    
    // First check if the Keycloak server is reachable - with proper error handling
    let healthResponse: any = { ok: false, status: 0, error: 'Request not sent' };
    try {
      const response = await fetch(`${keycloakUrl}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store',
      });
      healthResponse = {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      };
      
      // Try to get response text without assuming it's JSON
      try {
        const text = await response.text();
        if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
          healthResponse.responseType = 'html';
          healthResponse.snippet = text.substring(0, 100) + '...';
        } else {
          try {
            const data = JSON.parse(text);
            healthResponse.data = data;
            healthResponse.responseType = 'json';
          } catch (jsonError) {
            healthResponse.responseType = 'text';
            healthResponse.text = text.substring(0, 200) + (text.length > 200 ? '...' : '');
          }
        }
      } catch (textError) {
        healthResponse.error = 'Could not read response body';
      }
    } catch (error) {
      healthResponse.error = error instanceof Error ? error.message : 'Unknown error';
      healthResponse.name = error instanceof Error ? error.name : 'Unknown';
    }
    
    // Then check if the realm is available - with proper error handling
    let realmResponse: any = { ok: false, status: 0, error: 'Request not sent' };
    try {
      const response = await fetch(`${keycloakUrl}/realms/${realm}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store',
      });
      realmResponse = { 
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      };
      
      // Try to get response text without assuming it's JSON
      try {
        const text = await response.text();
        if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
          realmResponse.responseType = 'html';
          realmResponse.snippet = text.substring(0, 100) + '...';
        } else {
          try {
            const data = JSON.parse(text);
            realmResponse.data = data;
            realmResponse.responseType = 'json';
          } catch (jsonError) {
            realmResponse.responseType = 'text';
            realmResponse.text = text.substring(0, 200) + (text.length > 200 ? '...' : '');
          }
        }
      } catch (textError) {
        realmResponse.error = 'Could not read response body';
      }
    } catch (error) {
      realmResponse.error = error instanceof Error ? error.message : 'Unknown error';
      realmResponse.name = error instanceof Error ? error.name : 'Unknown';
    }
    
    // Return the diagnostics
    return NextResponse.json({
      keycloakUrl,
      realm,
      serverReachable: healthResponse.ok === true,
      serverDetails: healthResponse,
      realmAvailable: realmResponse.ok === true,
      realmDetails: realmResponse,
      serverTime: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextPublicKeycloakUrl: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
        nextPublicKeycloakRealm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
        nextPublicKeycloakClientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
      }
    }, { status: 200 });
  } catch (error) {
    console.error('[API] Keycloak check failed:', error);
    return NextResponse.json({
      error: 'Keycloak check failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null,
      keycloakUrl,
      realm,
      serverTime: new Date().toISOString(),
    }, { status: 500 });
  }
} 