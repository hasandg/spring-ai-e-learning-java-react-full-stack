#!/bin/bash

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
is_port_in_use() {
  if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
    return 0  # Port is in use
  else
    return 1  # Port is free
  fi
}

# Function to kill any process running on port 3001 (frontend)
kill_frontend() {
  if is_port_in_use 3001; then
    echo -e "${YELLOW}Shutting down existing frontend server...${NC}"
    pid=$(lsof -t -i:3001)
    if [ ! -z "$pid" ]; then
      kill -9 $pid
      echo -e "${GREEN}Killed process running on port 3001 (PID: $pid)${NC}"
    fi
  fi
}

# Function to kill any process running on port 8081 (auth service)
kill_auth_service() {
  if is_port_in_use 8081; then
    echo -e "${YELLOW}Shutting down existing auth service...${NC}"
    pid=$(lsof -t -i:8081)
    if [ ! -z "$pid" ]; then
      kill -9 $pid
      echo -e "${GREEN}Killed process running on port 8081 (PID: $pid)${NC}"
    fi
  fi
}

# Function to run auth service
run_auth_service() {
  echo -e "${BLUE}Starting mock auth service...${NC}"
  
  # Check if port 8081 is in use
  if is_port_in_use 8081; then
    kill_auth_service
  fi
  
  # Start the mock auth service
  cd backend
  node mock-auth-service.js &
  AUTH_PID=$!
  
  echo -e "${GREEN}Mock auth service running on http://localhost:8081${NC}"
  echo -e "${YELLOW}Service PID: ${AUTH_PID}${NC}"
  
  # Wait for auth-service to be ready
  echo -e "${YELLOW}Waiting for auth-service to start...${NC}"
  until $(curl --output /dev/null --silent --head --fail http://localhost:8081/api/auth/health); do
    printf '.'
    sleep 1
  done
  
  echo -e "${GREEN}Auth service is up and running!${NC}"
  cd ..
}

# Function to start the frontend
start_frontend() {
  kill_frontend
  
  echo -e "${BLUE}Starting frontend server...${NC}"
  
  # Navigate to frontend directory
  cd frontend
  
  # Create public directory if it doesn't exist
  mkdir -p public
  
  # Ensure we have the most recent files
  echo -e "${YELLOW}Starting HTTP server for frontend...${NC}"
  
  # Start Python HTTP server in the background
  python3 -m http.server 3001 --directory public &
  SERVER_PID=$!
  
  echo -e "${GREEN}Frontend server running on http://localhost:3001${NC}"
  echo -e "${YELLOW}Server PID: ${SERVER_PID}${NC}"
  
  cd ..
  
  # Return to the project root
  echo -e "${GREEN}You can access:${NC}"
  echo -e "  - ${BLUE}Frontend:${NC} http://localhost:3001"
  echo -e "  - ${BLUE}Auth API:${NC} http://localhost:8081/api/auth"
  echo -e "  - ${BLUE}Auth Health:${NC} http://localhost:8081/api/auth/health"
  echo -e "  - ${BLUE}Debug Console:${NC} http://localhost:3001/debug.html"
  echo -e "  - ${BLUE}Health Check:${NC} http://localhost:3001/health-check.html"
  echo -e "${YELLOW}Press Ctrl+C to stop the servers${NC}"
}

# Main execution
echo -e "${BLUE}===========================================${NC}"
echo -e "${GREEN}Starting E-Learning Platform Development Mode${NC}"
echo -e "${BLUE}===========================================${NC}"

# Run the services
run_auth_service
start_frontend

# Keep the script running to allow for easy termination of servers
trap 'echo -e "${RED}Shutting down servers...${NC}"; kill $SERVER_PID 2>/dev/null; kill $AUTH_PID 2>/dev/null; kill_frontend; kill_auth_service; exit 0' INT TERM
wait 