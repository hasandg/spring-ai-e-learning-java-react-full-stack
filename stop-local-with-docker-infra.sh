#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Stopping E-Learning Platform Local Services and Docker Infrastructure${NC}"

# Stop local services by killing processes
stop_local_services() {
  echo -e "${YELLOW}Stopping local services...${NC}"
  
  if [ -f backend/logs/auth-service.pid ]; then
    PID=$(cat backend/logs/auth-service.pid)
    if ps -p $PID > /dev/null; then
      echo -e "Stopping Auth Service (PID: $PID)"
      kill $PID
    fi
    rm backend/logs/auth-service.pid
  fi
  
  if [ -f backend/logs/user-service.pid ]; then
    PID=$(cat backend/logs/user-service.pid)
    if ps -p $PID > /dev/null; then
      echo -e "Stopping User Service (PID: $PID)"
      kill $PID
    fi
    rm backend/logs/user-service.pid
  fi
  
  if [ -f backend/logs/course-service.pid ]; then
    PID=$(cat backend/logs/course-service.pid)
    if ps -p $PID > /dev/null; then
      echo -e "Stopping Course Service (PID: $PID)"
      kill $PID
    fi
    rm backend/logs/course-service.pid
  fi
  
  if [ -f backend/logs/video-service.pid ]; then
    PID=$(cat backend/logs/video-service.pid)
    if ps -p $PID > /dev/null; then
      echo -e "Stopping Video Service (PID: $PID)"
      kill $PID
    fi
    rm backend/logs/video-service.pid
  fi
  
  if [ -f backend/logs/frontend.pid ]; then
    PID=$(cat backend/logs/frontend.pid)
    if ps -p $PID > /dev/null; then
      echo -e "Stopping Frontend (PID: $PID)"
      kill $PID
    fi
    rm backend/logs/frontend.pid
  fi
  
  echo -e "${GREEN}All local services stopped successfully.${NC}"
}

# Stop Docker infrastructure services
stop_docker_services() {
  echo -e "${YELLOW}Stopping Docker infrastructure services...${NC}"
  
  docker-compose -f docker-compose-infra.yml down
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to stop Docker infrastructure services.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}Docker infrastructure services stopped successfully.${NC}"
}

# Execute all steps
stop_local_services
stop_docker_services

echo ""
echo -e "${GREEN}All services have been stopped successfully.${NC}"
echo -e "Logs are still available in: ${YELLOW}backend/logs/${NC}" 