# Creating a Client in Keycloak

## Using the Admin Console:

1. **Access the Keycloak Admin Console**
   - Navigate to `http://localhost:8080/admin/` (or your Keycloak URL)
   - Log in with your admin credentials

2. **Select Your Realm**
   - From the dropdown in the upper left corner, select the realm where you want to create the client
   - Default is "master" but you might have created a custom realm

3. **Navigate to Clients**
   - In the left sidebar, click on "Clients"
   - Click "Create client" button

4. **Basic Settings**
   - **Client ID**: Enter a unique identifier (e.g., "my-app")
   - **Name**: Optional human-readable name
   - **Description**: Optional description
   - Click "Next"

5. **Capability Config**
   - **Client authentication**: Enable if you need a confidential client (with a secret)
   - **Authorization**: Enable if you need fine-grained authorization
   - **Standard flow**: Enable for browser-based authentication
   - **Direct access grants**: Enable for username/password login
   - Click "Next"

6. **Access Settings**
   - **Root URL**: The base URL of your application (e.g., "http://localhost:3000/")
   - **Valid redirect URIs**: Where Keycloak can redirect after authentication (e.g., "http://localhost:3000/*")
   - **Web origins**: CORS origins (e.g., "http://localhost:3000")
   - Click "Save"

7. **Retrieve Client Secret (for confidential clients)**
   - Go to the "Credentials" tab
   - Copy the client secret

## Using REST API:

If you prefer automation, you can create a client using Keycloak's REST API:

```bash
# First, get an access token
TOKEN=$(curl -X POST "http://localhost:8080/realms/master/protocol/openid-connect/token" \
  -d "client_id=admin-cli" \
  -d "username=admin" \
  -d "password=YOUR_PASSWORD" \
  -d "grant_type=password" | jq -r '.access_token')

# Then create a client
curl -X POST "http://localhost:8080/admin/realms/YOUR_REALM/clients" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "my-app",
    "name": "My Application",
    "description": "My application description",
    "enabled": true,
    "protocol": "openid-connect",
    "redirectUris": ["http://localhost:3000/*"],
    "webOrigins": ["http://localhost:3000"],
    "publicClient": false,
    "authorizationServicesEnabled": false,
    "serviceAccountsEnabled": true,
    "standardFlowEnabled": true,
    "directAccessGrantsEnabled": true
  }'
```

Remember to replace `YOUR_PASSWORD` and `YOUR_REALM` with your actual values. 