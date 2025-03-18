import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     description: Authenticate a user with Keycloak using direct access grant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful
 *       401:
 *         description: Invalid credentials
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!password) {
      return NextResponse.json(
        { message: 'Password is required' },
        { status: 400 }
      );
    }

    // Check if we have either username or email
    if (!username && !email) {
      return NextResponse.json(
        { message: 'Username or email is required' },
        { status: 400 }
      );
    }

    // Get Keycloak configuration from environment variables
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8090';
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'elearning';
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'frontend';
    const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET; // Optional, if your client is confidential

    console.log('Login attempt with:', { 
      keycloakUrl, 
      realm, 
      clientId, 
      username: username || email,
      hasClientSecret: !!clientSecret
    });

    // Direct token request using Resource Owner Password Credentials Grant
    const tokenUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`;
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('client_id', clientId);
    if (clientSecret) {
      formData.append('client_secret', clientSecret);
    }
    
    // First try with username
    if (username) {
      formData.append('username', username);
    } else if (email) {
      // If no username provided, use email as username
      formData.append('username', email);
    }
    formData.append('password', password);
    
    console.log(`Attempting login with username: ${formData.get('username')}`);
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      // If first attempt fails and we used username, try with email instead
      if (!response.ok && username && email && username !== email) {
        console.log('First login attempt failed, trying with email instead');
        
        const emailFormData = new URLSearchParams();
        emailFormData.append('grant_type', 'password');
        emailFormData.append('client_id', clientId);
        if (clientSecret) {
          emailFormData.append('client_secret', clientSecret);
        }
        emailFormData.append('username', email);
        emailFormData.append('password', password);
        
        const emailResponse = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: emailFormData.toString(),
        });
        
        if (emailResponse.ok) {
          const emailData = await emailResponse.json();
          return handleSuccessfulLogin(emailData, keycloakUrl, realm);
        }
      }
      
      console.error('Keycloak login failed:', data);
      return NextResponse.json(
        { message: data.error_description || 'Authentication failed' },
        { status: 401 }
      );
    }

    return handleSuccessfulLogin(data, keycloakUrl, realm);
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulLogin(data: any, keycloakUrl: string, realm: string) {
  // After successful authentication, fetch user info using the access token
  const userInfoUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/userinfo`;
  try {
    const userInfoResponse = await fetch(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();
    console.log('Login successful, user info retrieved');

    // Return tokens and user info to the client
    return NextResponse.json({
      token: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      user: {
        id: userInfo.sub,
        username: userInfo.preferred_username,
        email: userInfo.email,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        roles: userInfo.realm_access?.roles || [],
      },
    });
  } catch (userInfoError) {
    console.error('Error fetching user info:', userInfoError);
    // Still return the tokens even if user info fails
    return NextResponse.json({
      token: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      user: null
    });
  }
} 