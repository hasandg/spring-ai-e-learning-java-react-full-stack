#!/bin/bash

# Start local development environment without Docker
# This script starts the required services for local development

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting E-Learning Platform Development Environment${NC}"
echo -e "This script will start auth, user, course, and video services along with frontend"
echo ""

# Function to check if a port is in use
is_port_in_use() {
  lsof -i:$1 >/dev/null 2>&1
  return $?
}

# Check required dependencies
check_dependencies() {
  echo -e "${YELLOW}Checking dependencies...${NC}"
  
  # Check if Java is installed
  if ! command -v java &> /dev/null; then
    echo -e "${RED}Java is not installed. Please install Java 17 or higher.${NC}"
    exit 1
  fi
  
  # Check if Maven is installed
  if ! command -v mvn &> /dev/null; then
    echo -e "${YELLOW}Maven not found. Will use Maven wrapper instead.${NC}"
  fi
  
  # Check if Python is installed (for frontend simple server)
  if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 is not installed. Please install Python 3 for the frontend server.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}All dependencies satisfied.${NC}"
}

# Start the Auth Service
start_auth_service() {
  echo -e "${YELLOW}Starting Auth Service on port 8081...${NC}"
  if is_port_in_use 8081; then
    echo -e "${RED}Port 8081 is already in use. Auth Service may already be running.${NC}"
    return 1
  fi
  
  cd backend/auth-service
  if command -v mvn &> /dev/null; then
    mvn spring-boot:run > ../logs/auth-service.log 2>&1 &
  else
    ./mvnw spring-boot:run > ../logs/auth-service.log 2>&1 &
  fi
  AUTH_PID=$!
  echo $AUTH_PID > ../logs/auth-service.pid
  cd ../..
  echo -e "${GREEN}Auth Service started with PID: $AUTH_PID${NC}"
}

# Start the User Service
start_user_service() {
  echo -e "${YELLOW}Starting User Service on port 8082...${NC}"
  if is_port_in_use 8082; then
    echo -e "${RED}Port 8082 is already in use. User Service may already be running.${NC}"
    return 1
  fi
  
  cd backend/user-service
  if command -v mvn &> /dev/null; then
    mvn spring-boot:run > ../logs/user-service.log 2>&1 &
  else
    ./mvnw spring-boot:run > ../logs/user-service.log 2>&1 &
  fi
  USER_PID=$!
  echo $USER_PID > ../logs/user-service.pid
  cd ../..
  echo -e "${GREEN}User Service started with PID: $USER_PID${NC}"
}

# Start the Course Service
start_course_service() {
  echo -e "${YELLOW}Starting Course Service on port 8083...${NC}"
  if is_port_in_use 8083; then
    echo -e "${RED}Port 8083 is already in use. Course Service may already be running.${NC}"
    return 1
  fi
  
  cd backend/course-service
  if command -v mvn &> /dev/null; then
    mvn spring-boot:run > ../logs/course-service.log 2>&1 &
  else
    ./mvnw spring-boot:run > ../logs/course-service.log 2>&1 &
  fi
  COURSE_PID=$!
  echo $COURSE_PID > ../logs/course-service.pid
  cd ../..
  echo -e "${GREEN}Course Service started with PID: $COURSE_PID${NC}"
}

# Start the Video Service
start_video_service() {
  echo -e "${YELLOW}Starting Video Service on port 8084...${NC}"
  if is_port_in_use 8084; then
    echo -e "${RED}Port 8084 is already in use. Video Service may already be running.${NC}"
    return 1
  fi
  
  cd backend/video-service
  if command -v mvn &> /dev/null; then
    mvn spring-boot:run > ../logs/video-service.log 2>&1 &
  else
    ./mvnw spring-boot:run > ../logs/video-service.log 2>&1 &
  fi
  VIDEO_PID=$!
  echo $VIDEO_PID > ../logs/video-service.pid
  cd ../..
  echo -e "${GREEN}Video Service started with PID: $VIDEO_PID${NC}"
}

# Start the Frontend
start_frontend() {
  echo -e "${YELLOW}Starting Frontend on port 3001...${NC}"
  if is_port_in_use 3001; then
    echo -e "${RED}Port 3001 is already in use. Frontend may already be running.${NC}"
    return 1
  fi
  
  cd frontend
  python3 -m http.server 3001 > ../backend/logs/frontend.log 2>&1 &
  FRONTEND_PID=$!
  echo $FRONTEND_PID > ../backend/logs/frontend.pid
  cd ..
  echo -e "${GREEN}Frontend started with PID: $FRONTEND_PID${NC}"
}

# Create logs directory if it doesn't exist
mkdir -p backend/logs

# Start all services
check_dependencies
start_auth_service
start_user_service
start_course_service
start_video_service
start_frontend

echo ""
echo -e "${GREEN}All services started successfully!${NC}"
echo -e "Frontend is running at: ${YELLOW}http://localhost:3001${NC}"
echo -e "Auth Service is running at: ${YELLOW}http://localhost:8081${NC}"
echo -e "User Service is running at: ${YELLOW}http://localhost:8082${NC}"
echo -e "Course Service is running at: ${YELLOW}http://localhost:8083${NC}"
echo -e "Video Service is running at: ${YELLOW}http://localhost:8084${NC}"
echo ""
echo -e "To stop all services, run: ${YELLOW}./stop-local-dev.sh${NC}"
echo -e "Logs are available in: ${YELLOW}backend/logs/${NC}" 