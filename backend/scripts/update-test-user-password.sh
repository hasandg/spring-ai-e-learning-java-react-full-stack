#!/bin/bash

# Configuration
KEYCLOAK_URL=${KEYCLOAK_URL:-http://localhost:8090}
REALM=${REALM:-elearning}
ADMIN_USERNAME=${ADMIN_USERNAME:-admin}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin}
TEST_USER=${TEST_USER:-test}
NEW_PASSWORD=${NEW_PASSWORD:-Test@Pass123}

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Updating test user password in Keycloak...${NC}"
echo "Keycloak URL: $KEYCLOAK_URL"
echo "Realm: $REALM"
echo "Admin username: $ADMIN_USERNAME"
echo "Test user: $TEST_USER"

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
echo -e "\n${YELLOW}Getting user ID for user '$TEST_USER'...${NC}"
USER_ID=$(curl -s -X GET "$KEYCLOAK_URL/admin/realms/$REALM/users?username=$TEST_USER" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq -r '.[0].id')

if [ -z "$USER_ID" ] || [ "$USER_ID" == "null" ]; then
  echo -e "${RED}Failed to find user '$TEST_USER'. Make sure the user exists in the realm.${NC}"
  exit 1
fi

echo -e "${GREEN}User ID found: $USER_ID${NC}"

# Update password
echo -e "\n${YELLOW}Updating password for user '$TEST_USER'...${NC}"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$KEYCLOAK_URL/admin/realms/$REALM/users/$USER_ID/reset-password" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"password\",
    \"value\": \"$NEW_PASSWORD\",
    \"temporary\": false
  }")

if [ "$RESPONSE" -ne 204 ]; then
  echo -e "${RED}Failed to update password. HTTP response code: $RESPONSE${NC}"
  exit 1
fi

echo -e "${GREEN}Password for user '$TEST_USER' has been updated successfully to '$NEW_PASSWORD'.${NC}"
echo -e "\n${YELLOW}Remember to update any hardcoded credentials in your application!${NC}" 