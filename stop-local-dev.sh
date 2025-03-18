#!/bin/bash

# Stop local development environment
# This script stops all services started by start-local-dev.sh

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Stopping E-Learning Platform Development Environment${NC}"

# Stop services by reading PIDs from files
LOGS_DIR="backend/logs"

# Function to stop a service
stop_service() {
  local service_name=$1
  local pid_file="${LOGS_DIR}/${service_name}.pid"
  
  if [ -f "$pid_file" ]; then
    local pid=$(cat "$pid_file")
    echo -e "Stopping ${service_name} (PID: $pid)..."
    
    if ps -p $pid > /dev/null; then
      kill $pid
      echo -e "${GREEN}${service_name} stopped successfully.${NC}"
    else
      echo -e "${YELLOW}${service_name} is not running with PID: $pid${NC}"
    fi
    
    rm -f "$pid_file"
  else
    echo -e "${YELLOW}No PID file found for ${service_name}.${NC}"
  fi
}

# Stop all services
stop_service "auth-service"
stop_service "user-service"
stop_service "course-service"
stop_service "video-service"
stop_service "frontend"

echo ""
echo -e "${GREEN}All services stopped successfully!${NC}"

# Optionally, check if any processes are still using the service ports
check_port() {
  local port=$1
  local service=$2
  
  if lsof -i:$port >/dev/null 2>&1; then
    echo -e "${YELLOW}Warning: Port $port ($service) is still in use.${NC}"
    echo -e "You may need to manually kill the process:"
    echo -e "${YELLOW}lsof -i:$port${NC}"
    echo -e "${YELLOW}kill -9 <PID>${NC}"
  fi
}

# Check if any service ports are still in use
echo -e "${YELLOW}Checking for remaining services...${NC}"
check_port 8081 "Auth Service"
check_port 8082 "User Service"
check_port 8083 "Course Service"
check_port 8084 "Video Service"
check_port 3001 "Frontend"

echo ""
echo -e "You can restart the services with: ${YELLOW}./start-local-dev.sh${NC}" 