import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     description: Register a new user with Keycloak
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: User already exists
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password, firstName, lastName, roles = ['USER'] } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Get Keycloak configuration from environment variables
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8090';
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'elearning';
    const adminUser = process.env.KEYCLOAK_ADMIN || 'admin';
    const adminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin';

    console.log('Using Keycloak config:', { 
      keycloakUrl, 
      realm
    });

    // First, get an admin token to manage users
    const tokenUrl = `${keycloakUrl}/realms/master/protocol/openid-connect/token`;
    
    const tokenFormData = new URLSearchParams();
    tokenFormData.append('grant_type', 'password');
    tokenFormData.append('client_id', 'admin-cli');
    tokenFormData.append('username', adminUser);
    tokenFormData.append('password', adminPassword);
    
    console.log(`Getting admin token for user registration...`);
    
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenFormData.toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Failed to get admin token:', tokenData);
      return NextResponse.json(
        { message: 'Failed to authenticate with Keycloak admin' },
        { status: 500 }
      );
    }

    const adminToken = tokenData.access_token;

    // Check if realm exists
    try {
      const realmCheckUrl = `${keycloakUrl}/admin/realms`;
      const realmCheckResponse = await fetch(realmCheckUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });
      
      if (!realmCheckResponse.ok) {
        console.error('Failed to list realms:', await realmCheckResponse.text());
        return NextResponse.json(
          { message: 'Failed to access Keycloak realms' },
          { status: 500 }
        );
      }
      
      const realms = await realmCheckResponse.json();
      console.log('Available realms:', realms.map((r: any) => r.realm).join(', '));
      
      const realmExists = realms.some((r: any) => r.realm === realm);
      if (!realmExists) {
        console.error(`Realm "${realm}" not found. Available realms: ${realms.map((r: any) => r.realm).join(', ')}`);
        return NextResponse.json(
          { message: `Keycloak realm "${realm}" not found. Please create it in the Keycloak admin console.` },
          { status: 404 }
        );
      }
    } catch (realmCheckError) {
      console.error('Error checking realm:', realmCheckError);
    }

    // Now create the user
    const createUserUrl = `${keycloakUrl}/admin/realms/${realm}/users`;
    
    const userData = {
      username,
      email,
      enabled: true,
      emailVerified: true, // For testing purposes, you might want to set this to false in production
      firstName,
      lastName,
      credentials: [
        {
          type: 'password',
          value: password,
          temporary: false,
        },
      ],
      attributes: {
        origin: 'custom-form',
      },
    };

    console.log(`Creating user: ${username} with email: ${email}`);
    
    const createResponse = await fetch(createUserUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(userData),
    });

    // Check if user creation was successful
    if (!createResponse.ok) {
      // If 409, user already exists
      if (createResponse.status === 409) {
        return NextResponse.json(
          { message: 'User with this username or email already exists' },
          { status: 409 }
        );
      }

      const errorText = await createResponse.text();
      console.error('Failed to create user:', errorText);
      return NextResponse.json(
        { message: 'Failed to create user in Keycloak' },
        { status: createResponse.status }
      );
    }

    // Get the user ID to assign roles
    const getUsersUrl = `${keycloakUrl}/admin/realms/${realm}/users?username=${username}&exact=true`;
    const getUserResponse = await fetch(getUsersUrl, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    const users = await getUserResponse.json();

    if (!getUserResponse.ok || !users.length) {
      console.error('Failed to find newly created user');
      return NextResponse.json(
        { message: 'User created but could not assign roles' },
        { status: 201 }
      );
    }

    const userId = users[0].id;

    // Assign roles if provided
    if (roles && roles.length > 0) {
      // Get available roles
      const getRolesUrl = `${keycloakUrl}/admin/realms/${realm}/roles`;
      const getRolesResponse = await fetch(getRolesUrl, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const availableRoles = await getRolesResponse.json();
      
      // Filter roles that exist in the realm
      const rolesToAssign = availableRoles
        .filter((role: {name: string}) => roles.includes(role.name))
        .map((role: {id: string, name: string}) => ({ id: role.id, name: role.name }));

      if (rolesToAssign.length > 0) {
        // Assign roles to user
        const assignRolesUrl = `${keycloakUrl}/admin/realms/${realm}/users/${userId}/role-mappings/realm`;
        await fetch(assignRolesUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(rolesToAssign),
        });
      }
    }

    // Return success response
    return NextResponse.json(
      { 
        message: 'User registered successfully',
        userId,
        username,
        email 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred during registration' },
      { status: 500 }
    );
  }
} 