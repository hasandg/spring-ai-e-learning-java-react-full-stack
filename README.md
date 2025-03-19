# E-Learning Platform

A comprehensive e-learning platform built with a microservices architecture, orchestrated with Kubernetes.

## Architecture Overview

The E-Learning Platform is built as a set of microservices, each with its own responsibility:

- **Auth Service**: Handles authentication and authorization
- **User Service**: Manages user profiles and data
- **Course Service**: Handles course creation and management
- **Video Service**: Manages video content and streaming
- **Frontend**: React-based user interface

## Key Technologies

- **Backend**: Spring Boot, Spring Cloud Kubernetes
- **Frontend**: React, Redux, Material-UI
- **Data Storage**: PostgreSQL, Redis
- **Messaging**: Apache Kafka
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Monitoring**: Prometheus, Grafana
- **Tracing**: Zipkin
- **CI/CD**: Jenkins

## Migration to Kubernetes Orchestration

This project has been migrated from using Netflix Eureka for service discovery to using Kubernetes native orchestration. The key benefits of this migration include:

1. **Simplified Architecture**: Kubernetes handles service discovery, removing the need for Eureka.
2. **Improved Scalability**: Kubernetes provides robust scaling capabilities.
3. **Better Resource Utilization**: Resources are allocated and managed more efficiently.
4. **Enhanced Resilience**: Kubernetes handles node failures and service restarts automatically.

For detailed information about the migration, see [Migration Guide](k8s/MIGRATION.md).

## Project Structure

```
e-learning-platform/
├── backend/             # Backend microservices
│   ├── auth-service/    # Authentication service
│   ├── user-service/    # User management service
│   ├── course-service/  # Course management service
│   ├── video-service/   # Video management service
│   └── common-lib/      # Shared libraries
├── frontend/            # React frontend app
├── k8s/                 # Kubernetes deployment manifests
│   ├── infrastructure/  # Infrastructure services (DB, Kafka, etc.)
│   ├── services/        # Microservice deployments
│   └── config/          # ConfigMaps and common configuration
└── Jenkinsfile          # CI/CD pipeline
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Kubernetes cluster (local or cloud-based)
- kubectl
- Java 21
- Node.js 18+
- Maven

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/e-learning-platform.git
   cd e-learning-platform
   ```

2. **Start infrastructure services with Docker Compose (for development)**

   ```bash
   cd backend
   docker-compose up -d postgres redis kafka
   ```

3. **Build and run backend services**

   ```bash
   ./mvnw clean install
   ```

   Each service can be run individually:

   ```bash
   cd api-gateway
   ../mvnw spring-boot:run
   ```

4. **Start the frontend**

   ```bash
   cd frontend
   npm install
   npm start
   ```

### Kubernetes Deployment

1. **Build Docker images**

   ```bash
   # Build backend images
   cd backend
   docker build -t yourdockerregistry/api-gateway:latest -f api-gateway/Dockerfile .
   # Repeat for other services
   
   # Build frontend
   cd ../frontend
   docker build -t yourdockerregistry/frontend:latest .
   ```

2. **Deploy to Kubernetes**

   ```bash
   cd ../k8s
   kubectl apply -k ./
   ```

3. **Verify deployment**

   ```bash
   kubectl get pods -n e-learning
   kubectl get services -n e-learning
   ```

## Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

# React Frontend with Advanced UI Components

This project demonstrates various advanced UI components and features implemented in React with TypeScript and Material UI.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/my-frontend.git
cd my-frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── examples/       # Example components demonstrating features
├── hooks/          # Custom React hooks
├── pages/          # Application pages
├── routes/         # Route definitions
├── services/       # API and other services
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Technologies Used

- React
- TypeScript
- Material UI
- React Router

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Test Credentials

The system comes with a predefined test user:

- **Username**: test
- **Password**: Test@Pass123

You can also register a new account using the registration form.

## Updating Test User Password

If you need to change the test user password, you can use the provided script:

```bash
cd backend/scripts
./update-test-user-password.sh
```

This script requires Keycloak to be running and the admin credentials to be correct. You can customize the parameters by setting environment variables:

```bash
export KEYCLOAK_URL=http://localhost:8090
export REALM=elearning
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=admin
export TEST_USER=test
export NEW_PASSWORD=your_new_password

./update-test-user-password.sh
```

## Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
``` 