#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting E-Learning Platform with Local Services and Docker Infrastructure${NC}"
echo -e "This script will start Docker infrastructure services and local instances of microservices"
echo ""

# Function to check if a port is in use
is_port_in_use() {
  lsof -i:$1 >/dev/null 2>&1
  return $?
}

# Check required dependencies
check_dependencies() {
  echo -e "${YELLOW}Checking dependencies...${NC}"
  
  # Check if Docker is installed
  if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker and Docker Compose.${NC}"
    exit 1
  fi
  
  # Check if Java is installed
  if ! command -v java &> /dev/null; then
    echo -e "${RED}Java is not installed. Please install Java 17 or higher.${NC}"
    exit 1
  fi
  
  # Check if Node.js is installed (for frontend)
  if ! command -v npm &> /dev/null; then
    echo -e "${RED}Node.js/npm is not installed. Please install Node.js for the frontend.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}All dependencies satisfied.${NC}"
}

# Create logs directory if it doesn't exist
mkdir -p backend/logs

# Start Docker infrastructure services
start_docker_infra() {
  echo -e "${YELLOW}Starting Docker infrastructure services...${NC}"
  docker-compose -f docker-compose-infra.yml up -d
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to start Docker infrastructure services.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}Docker infrastructure services started successfully.${NC}"
}

# Start the Auth Service
start_auth_service() {
  echo -e "${YELLOW}Starting Auth Service on port 8081...${NC}"
  if is_port_in_use 8081; then
    echo -e "${RED}Port 8081 is already in use. Auth Service may already be running.${NC}"
    return 1
  fi
  
  cd backend/auth-service
  export SPRING_PROFILES_ACTIVE=local
  export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/auth_service_db
  export SPRING_REDIS_HOST=localhost
  
  cd ../..
  echo -e "${GREEN}Auth Service started${NC}"
}

# Start the User Service
start_user_service() {
  echo -e "${YELLOW}Starting User Service on port 8082...${NC}"
  if is_port_in_use 8082; then
    echo -e "${RED}Port 8082 is already in use. User Service may already be running.${NC}"
    return 1
  fi
  
  cd backend/user-service
  export SPRING_PROFILES_ACTIVE=local
  export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/user_service_db
  export SPRING_KAFKA_BOOTSTRAP_SERVERS=localhost:9092
  export MANAGEMENT_ZIPKIN_TRACING_ENDPOINT=http://localhost:9411/api/v2/spans
  
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
  export SPRING_PROFILES_ACTIVE=local
  export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/course_service_db
  export SPRING_KAFKA_BOOTSTRAP_SERVERS=localhost:9092
  export MANAGEMENT_ZIPKIN_TRACING_ENDPOINT=http://localhost:9411/api/v2/spans
  
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
  export SPRING_PROFILES_ACTIVE=local
  export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/video_service_db
  export SPRING_KAFKA_BOOTSTRAP_SERVERS=localhost:9092
  export MANAGEMENT_ZIPKIN_TRACING_ENDPOINT=http://localhost:9411/api/v2/spans
  
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
  echo -e "${YELLOW}Starting Frontend on port 3000...${NC}"
  if is_port_in_use 3000; then
    echo -e "${RED}Port 3000 is already in use. Frontend may already be running.${NC}"
    return 1
  fi
  
  cd frontend
  # Check if we need to install dependencies
  if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
  fi
  
  npm start > ../backend/logs/frontend.log 2>&1 &
  FRONTEND_PID=$!
  echo $FRONTEND_PID > ../backend/logs/frontend.pid
  cd ..
  echo -e "${GREEN}Frontend started with PID: $FRONTEND_PID${NC}"
}

# Execute all steps
check_dependencies
start_docker_infra

# Wait for infrastructure services to be ready
echo -e "${YELLOW}Waiting for infrastructure services to be ready...${NC}"
sleep 10

# Start all application services
start_auth_service
start_user_service
start_course_service
start_video_service
start_frontend

echo ""
echo -e "${GREEN}All services started successfully!${NC}"
echo -e "Frontend is running at: ${YELLOW}http://localhost:3000${NC}"
echo -e "Auth Service is running at: ${YELLOW}http://localhost:8081${NC}"
echo -e "User Service is running at: ${YELLOW}http://localhost:8082${NC}"
echo -e "Course Service is running at: ${YELLOW}http://localhost:8083${NC}"
echo -e "Video Service is running at: ${YELLOW}http://localhost:8084${NC}"
echo ""
echo -e "Infrastructure Services:"
echo -e "Kafka UI is available at: ${YELLOW}http://localhost:8090${NC}"
echo -e "Zipkin is available at: ${YELLOW}http://localhost:9411${NC}"
echo -e "Kibana is available at: ${YELLOW}http://localhost:5601${NC}"
echo -e "Prometheus is available at: ${YELLOW}http://localhost:9090${NC}"
echo -e "Grafana is available at: ${YELLOW}http://localhost:3000${NC}"
echo ""
echo -e "To stop all services, run: ${YELLOW}./stop-local-dev.sh${NC}"
echo -e "Logs are available in: ${YELLOW}backend/logs/${NC}" 