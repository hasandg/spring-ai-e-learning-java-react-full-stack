# PowerShell script to stop microservices and Docker infrastructure
# Colors for terminal output
$Green = "`e[32m"
$Yellow = "`e[33m"
$Red = "`e[31m"
$NC = "`e[0m" # No Color

Write-Host "$Yellow Stopping E-Learning Platform Local Services and Docker Infrastructure $NC"

# Stop local services by killing processes
function Stop-LocalServices {
    Write-Host "$Yellow Stopping local services... $NC"
    
    # Check if PID files exist and kill the processes
    $services = @(
        @{Name = "API Gateway"; PidFile = "backend\logs\api-gateway.pid"},
        @{Name = "Auth Service"; PidFile = "backend\logs\auth-service.pid"},
        @{Name = "User Service"; PidFile = "backend\logs\user-service.pid"},
        @{Name = "Course Service"; PidFile = "backend\logs\course-service.pid"},
        @{Name = "Video Service"; PidFile = "backend\logs\video-service.pid"},
        @{Name = "Frontend"; PidFile = "backend\logs\frontend.pid"}
    )
    
    foreach ($service in $services) {
        if (Test-Path $service.PidFile) {
            $pid = Get-Content $service.PidFile
            $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
            
            if ($process) {
                Write-Host "Stopping $($service.Name) (PID: $pid)"
                Stop-Process -Id $pid -Force
            } else {
                Write-Host "Process for $($service.Name) with PID $pid not found"
            }
            
            Remove-Item $service.PidFile -Force
        }
    }
    
    Write-Host "$Green All local services stopped successfully. $NC"
}

# Stop Docker infrastructure services
function Stop-DockerServices {
    Write-Host "$Yellow Stopping Docker infrastructure services... $NC"
    
    docker-compose -f docker-compose-infra.yml down
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "$Red Failed to stop Docker infrastructure services. $NC"
        exit 1
    }
    
    Write-Host "$Green Docker infrastructure services stopped successfully. $NC"
}

# Execute all steps
Stop-LocalServices
Stop-DockerServices

Write-Host ""
Write-Host "$Green All services have been stopped successfully. $NC"
Write-Host "Logs are still available in: $Yellow backend\logs\ $NC" 