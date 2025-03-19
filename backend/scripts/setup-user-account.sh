#!/bin/bash

# Configuration
KEYCLOAK_URL=${KEYCLOAK_URL:-http://localhost:8090}
REALM=${REALM:-elearning}
ADMIN_USERNAME=${ADMIN_USERNAME:-admin}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin}
TARGET_USER=${TARGET_USER:-test2}
NEW_PASSWORD=${NEW_PASSWORD:-Test@Pass123}

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up user account in Keycloak...${NC}"
echo "Keycloak URL: $KEYCLOAK_URL"
echo "Realm: $REALM"
echo "Admin username: $ADMIN_USERNAME"
echo "Target user: $TARGET_USER"

# Get admin token
echo -e "\n${YELLOW}Getting admin token...${NC}"
ADMIN_TOKEN=$(curl -s -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" \
  -d "username=$ADMIN_USERNAME" \
  -d "password=$ADMIN_PASSWORD" | jq -r '.access_token')

if [ -z "$ADMIN_TOKEN" ] || [ "$ADMIN_TOKEN" == "null" ]; then
  echo -e "${RED}Failed to get admin token. Make sure Keycloak is running and admin credentials are correct.${NC}"
  exit 1
fi

echo -e "${GREEN}Admin token obtained successfully.${NC}"

# Get user ID
echo -e "\n${YELLOW}Getting user ID for user '$TARGET_USER'...${NC}"
USER_ID=$(curl -s -X GET "$KEYCLOAK_URL/admin/realms/$REALM/users?username=$TARGET_USER" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq -r '.[0].id')

if [ -z "$USER_ID" ] || [ "$USER_ID" == "null" ]; then
  echo -e "${RED}Failed to find user '$TARGET_USER'. Make sure the user exists in the realm.${NC}"
  exit 1
fi

echo -e "${GREEN}User ID found: $USER_ID${NC}"

# Get current user details
echo -e "\n${YELLOW}Getting current user details...${NC}"
USER_DETAILS=$(curl -s -X GET "$KEYCLOAK_URL/admin/realms/$REALM/users/$USER_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

# Print current user status
echo -e "\n${YELLOW}Current user status:${NC}"
echo "$USER_DETAILS" | jq '{username: .username, enabled: .enabled, emailVerified: .emailVerified, requiredActions: .requiredActions}'

# Update user account to be fully set up
echo -e "\n${YELLOW}Updating user account to be fully set up...${NC}"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$KEYCLOAK_URL/admin/realms/$REALM/users/$USER_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"enabled\": true,
    \"emailVerified\": true,
    \"requiredActions\": []
  }")

if [ "$RESPONSE" -ne 204 ]; then
  echo -e "${RED}Failed to update user account. HTTP response code: $RESPONSE${NC}"
  exit 1
fi

echo -e "${GREEN}User account for '$TARGET_USER' has been fully set up.${NC}"

# Update password
echo -e "\n${YELLOW}Updating password for user '$TARGET_USER'...${NC}"
PWD_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$KEYCLOAK_URL/admin/realms/$REALM/users/$USER_ID/reset-password" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"password\",
    \"value\": \"$NEW_PASSWORD\",
    \"temporary\": false
  }")

if [ "$PWD_RESPONSE" -ne 204 ]; then
  echo -e "${RED}Failed to update password. HTTP response code: $PWD_RESPONSE${NC}"
  exit 1
fi

echo -e "${GREEN}Password for user '$TARGET_USER' has been updated to '$NEW_PASSWORD'.${NC}"

# Verify the changes
echo -e "\n${YELLOW}Verifying user account changes...${NC}"
UPDATED_USER=$(curl -s -X GET "$KEYCLOAK_URL/admin/realms/$REALM/users/$USER_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

echo -e "\n${YELLOW}Updated user status:${NC}"
echo "$UPDATED_USER" | jq '{username: .username, enabled: .enabled, emailVerified: .emailVerified, requiredActions: .requiredActions}'

echo -e "\n${GREEN}User account setup complete! You should now be able to log in with this account.${NC}" 