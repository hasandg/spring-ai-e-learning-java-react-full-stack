# PowerShell script to run microservices locally with 3rd party Docker services
# Colors for terminal output
$Green = "`e[32m"
$Yellow = "`e[33m"
$Red = "`e[31m"
$NC = "`e[0m" # No Color

Write-Host "$Yellow Starting E-Learning Platform with Local Services and Docker Infrastructure $NC"
Write-Host "This script will start Docker infrastructure services and local instances of microservices"
Write-Host ""

# Function to check if a port is in use
function Is-PortInUse {
    param (
        [int]$Port
    )
    
    $connections = netstat -ano | Select-String -Pattern ":$Port "
    return ($connections -ne $null)
}

# Check required dependencies
function Check-Dependencies {
    Write-Host "$Yellow Checking dependencies... $NC"
    
    # Check if Docker is installed
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Host "$Red Docker is not installed. Please install Docker and Docker Compose. $NC"
        exit 1
    }
    
    # Check if Java is installed
    if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
        Write-Host "$Red Java is not installed. Please install Java 17 or higher. $NC"
        exit 1
    }
    
    # Check if Node.js is installed (for frontend)
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Host "$Red Node.js/npm is not installed. Please install Node.js for the frontend. $NC"
        exit 1
    }
    
    Write-Host "$Green All dependencies satisfied. $NC"
}

# Create logs directory if it doesn't exist
if (-not (Test-Path "backend\logs")) {
    New-Item -Path "backend\logs" -ItemType Directory | Out-Null
}

# Start Docker infrastructure services
function Start-DockerInfra {
    Write-Host "$Yellow Starting Docker infrastructure services... $NC"
    
    docker-compose -f docker-compose-infra.yml up -d
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "$Red Failed to start Docker infrastructure services. $NC"
        exit 1
    }
    
    Write-Host "$Green Docker infrastructure services started successfully. $NC"
}

# Start the API Gateway
function Start-ApiGateway {
    Write-Host "$Yellow Starting API Gateway on port 8080... $NC"
    if (Is-PortInUse 8080) {
        Write-Host "$Red Port 8080 is already in use. API Gateway may already be running. $NC"
        return
    }
    
    Push-Location backend\api-gateway
    $env:SPRING_PROFILES_ACTIVE = "local"
    
    if (Get-Command mvn -ErrorAction SilentlyContinue) {
        Start-Process -FilePath "mvn" -ArgumentList "spring-boot:run" -RedirectStandardOutput "..\logs\api-gateway.log" -RedirectStandardError "..\logs\api-gateway-error.log" -NoNewWindow
    } else {
        Start-Process -FilePath ".\mvnw" -ArgumentList "spring-boot:run" -RedirectStandardOutput "..\logs\api-gateway.log" -RedirectStandardError "..\logs\api-gateway-error.log" -NoNewWindow
    }
    
    $pid = $PID
    $pid | Out-File -FilePath "..\logs\api-gateway.pid"
    Pop-Location
    
    Write-Host "$Green API Gateway started with PID: $pid $NC"
}

# Start the Auth Service
function Start-AuthService {
    Write-Host "$Yellow Starting Auth Service on port 8081... $NC"
    if (Is-PortInUse 8081) {
        Write-Host "$Red Port 8081 is already in use. Auth Service may already be running. $NC"
        return
    }
    
    Push-Location backend\auth-service
    $env:SPRING_PROFILES_ACTIVE = "local"
    $env:SPRING_DATASOURCE_URL = "jdbc:postgresql://localhost:5432/auth_service_db"
    $env:SPRING_REDIS_HOST = "localhost"
    
    if (Get-Command mvn -ErrorAction SilentlyContinue) {
        Start-Process -FilePath "mvn" -ArgumentList "spring-boot:run" -RedirectStandardOutput "..\logs\auth-service.log" -RedirectStandardError "..\logs\auth-service-error.log" -NoNewWindow
    } else {
        Start-Process -FilePath ".\mvnw" -ArgumentList "spring-boot:run" -RedirectStandardOutput "..\logs\auth-service.log" -RedirectStandardError "..\logs\auth-service-error.log" -NoNewWindow
    }
    
    $pid = $PID
    $pid | Out-File -FilePath "..\logs\auth-service.pid"
    Pop-Location
    
    Write-Host "$Green Auth Service started with PID: $pid $NC"
}

# Start the User Service
function Start-UserService {
    Write-Host "$Yellow Starting User Service on port 8082... $NC"
    if (Is-PortInUse 8082) {
        Write-Host "$Red Port 8082 is already in use. User Service may already be running. $NC"
        return
    }
    
    Push-Location backend\user-service
    $env:SPRING_PROFILES_ACTIVE = "local"
    $env:SPRING_DATASOURCE_URL = "jdbc:postgresql://localhost:5432/user_service_db"
    $env:SPRING_KAFKA_BOOTSTRAP_SERVERS = "localhost:9092"
    $env:MANAGEMENT_ZIPKIN_TRACING_ENDPOINT = "http://localhost:9411/api/v2/spans"
    
    if (Get-Command mvn -ErrorAction SilentlyContinue) {
        Start-Process -FilePath "mvn" -ArgumentList "spring-boot:run" -RedirectStandardOutput "..\logs\user-service.log" -RedirectStandardError "..\logs\user-service-error.log" -NoNewWindow
    } else {
        Start-Process -FilePath ".\mvnw" -ArgumentList "spring-boot:run" -RedirectStandardOutput "..\logs\user-service.log" -RedirectStandardError "..\logs\user-service-error.log" -NoNewWindow
    }
    
    $pid = $PID
    $pid | Out-File -FilePath "..\logs\user-service.pid"
    Pop-Location
    
    Write-Host "$Green User Service started with PID: $pid $NC"
}

# Start the Course Service
function Start-CourseService {
    Write-Host "$Yellow Starting Course Service on port 8083... $NC"
    if (Is-PortInUse 8083) {
        Write-Host "$Red Port 8083 is already in use. Course Service may already be running. $NC"
        return
    }
    
    Push-Location backend\course-service
    $env:SPRING_PROFILES_ACTIVE = "local"
    $env:SPRING_DATASOURCE_URL = "jdbc:postgresql://localhost:5432/course_service_db"
    $env:SPRING_KAFKA_BOOTSTRAP_SERVERS = "localhost:9092"
    $env:MANAGEMENT_ZIPKIN_TRACING_ENDPOINT = "http://localhost:9411/api/v2/spans"
    
    if (Get-Command mvn -ErrorAction SilentlyContinue) {
        Start-Process -FilePath "mvn" -ArgumentList "spring-boot:run" -RedirectStandardOutput "..\logs\course-service.log" -RedirectStandardError "..\logs\course-service-error.log" -NoNewWindow
    } else {
        Start-Process -FilePath ".\mvnw" -ArgumentList "spring-boot:run" -RedirectStandardOutput "..\logs\course-service.log" -RedirectStandardError "..\logs\course-service-error.log" -NoNewWindow
    }
    
    $pid = $PID
    $pid | Out-File -FilePath "..\logs\course-service.pid"
    Pop-Location
    
    Write-Host "$Green Course Service started with PID: $pid $NC"
}

# Start the Video Service
function Start-VideoService {
    Write-Host "$Yellow Starting Video Service on port 8084... $NC"
    if (Is-PortInUse 8084) {
        Write-Host "$Red Port 8084 is already in use. Video Service may already be running. $NC"
        return
    }
    
    Push-Location backend\video-service
    $env:SPRING_PROFILES_ACTIVE = "local"
    $env:SPRING_DATASOURCE_URL = "jdbc:postgresql://localhost:5432/video_service_db"
    $env:SPRING_KAFKA_BOOTSTRAP_SERVERS = "localhost:9092"
    $env:MANAGEMENT_ZIPKIN_TRACING_ENDPOINT = "http://localhost:9411/api/v2/spans"
    
    if (Get-Command mvn -ErrorAction SilentlyContinue) {
        Start-Process -FilePath "mvn" -ArgumentList "spring-boot:run" -RedirectStandardOutput "..\logs\video-service.log" -RedirectStandardError "..\logs\video-service-error.log" -NoNewWindow
    } else {
        Start-Process -FilePath ".\mvnw" -ArgumentList "spring-boot:run" -RedirectStandardOutput "..\logs\video-service.log" -RedirectStandardError "..\logs\video-service-error.log" -NoNewWindow
    }
    
    $pid = $PID
    $pid | Out-File -FilePath "..\logs\video-service.pid"
    Pop-Location
    
    Write-Host "$Green Video Service started with PID: $pid $NC"
}

# Start the Frontend
function Start-Frontend {
    Write-Host "$Yellow Starting Frontend on port 3000... $NC"
    if (Is-PortInUse 3000) {
        Write-Host "$Red Port 3000 is already in use. Frontend may already be running. $NC"
        return
    }
    
    Push-Location frontend
    # Check if we need to install dependencies
    if (-not (Test-Path "node_modules")) {
        Write-Host "$Yellow Installing frontend dependencies... $NC"
        npm install
    }
    
    Start-Process -FilePath "npm" -ArgumentList "start" -RedirectStandardOutput "..\backend\logs\frontend.log" -RedirectStandardError "..\backend\logs\frontend-error.log" -NoNewWindow
    
    $pid = $PID
    $pid | Out-File -FilePath "..\backend\logs\frontend.pid"
    Pop-Location
    
    Write-Host "$Green Frontend started with PID: $pid $NC"
}

# Execute all steps
Check-Dependencies
Start-DockerInfra

# Wait for infrastructure services to be ready
Write-Host "$Yellow Waiting for infrastructure services to be ready... $NC"
Start-Sleep -Seconds 10

# Start all application services
Start-ApiGateway
Start-AuthService
Start-UserService
Start-CourseService
Start-VideoService
Start-Frontend

Write-Host ""
Write-Host "$Green All services started successfully! $NC"
Write-Host "Frontend is running at: $Yellow http://localhost:3000 $NC"
Write-Host "API Gateway is running at: $Yellow http://localhost:8080 $NC"
Write-Host "Auth Service is running at: $Yellow http://localhost:8081 $NC"
Write-Host "User Service is running at: $Yellow http://localhost:8082 $NC"
Write-Host "Course Service is running at: $Yellow http://localhost:8083 $NC"
Write-Host "Video Service is running at: $Yellow http://localhost:8084 $NC"
Write-Host ""
Write-Host "Infrastructure Services:"
Write-Host "Kafka UI is available at: $Yellow http://localhost:8090 $NC"
Write-Host "Zipkin is available at: $Yellow http://localhost:9411 $NC"
Write-Host "Kibana is available at: $Yellow http://localhost:5601 $NC"
Write-Host "Prometheus is available at: $Yellow http://localhost:9090 $NC"
Write-Host "Grafana is available at: $Yellow http://localhost:3000 $NC"
Write-Host ""
Write-Host "To stop all services, run: $Yellow .\stop-local-with-docker-infra.ps1 $NC"
Write-Host "Logs are available in: $Yellow backend\logs\ $NC" 