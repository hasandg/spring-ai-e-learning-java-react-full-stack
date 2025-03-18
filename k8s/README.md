# E-Learning Platform Kubernetes Deployment

This directory contains the Kubernetes manifests for deploying the E-Learning Platform microservices architecture.

## Architecture

The e-learning platform uses a microservices architecture orchestrated with Kubernetes instead of relying on a separate service discovery mechanism like Eureka. Kubernetes provides built-in service discovery, load balancing, scaling, and management of containerized applications.

## Directory Structure

- `namespace.yaml` - Defines the e-learning namespace
- `config/` - ConfigMaps for shared configuration
- `infrastructure/` - Essential infrastructure services (PostgreSQL, Redis, Kafka, monitoring)
- `services/` - Microservices (API Gateway, Auth Service, etc.)
- `kustomization.yaml` - Kustomize configuration for easy deployment

## Key Components

1. **Infrastructure Services**
   - PostgreSQL - Persistent data storage for microservices
   - Redis - In-memory data store and caching
   - Kafka - Event streaming for asynchronous communication
   - Zipkin - Distributed tracing
   - Prometheus & Grafana - Monitoring and visualization

2. **Microservices**
   - API Gateway - Entry point for frontend requests
   - Auth Service - Authentication and authorization
   - User Service - User management
   - Course Service - Course content management
   - Video Service - Video content management
   - Frontend - User interface

## Deployment

### Prerequisites

- Kubernetes cluster (local or cloud-based)
- kubectl (Kubernetes command-line tool)
- kustomize (optional, built into recent kubectl versions)

### Deployment Steps

1. Apply the kustomization:

```bash
kubectl apply -k ./
```

2. Verify the deployment:

```bash
kubectl get pods -n e-learning
```

3. Access the application:

The application can be accessed through the Ingress controller. Add the following entry to your hosts file:

```
127.0.0.1 e-learning.local
```

Then access the application at http://e-learning.local

## Migration from Eureka Discovery

This deployment represents a migration from using Netflix Eureka for service discovery to using Kubernetes native service discovery. Key changes include:

1. Removal of Eureka server and client dependencies
2. Addition of Spring Cloud Kubernetes dependencies
3. Service communication via Kubernetes Service DNS names
4. Health checks and readiness/liveness probes
5. Resource limits and requests for proper scheduling

## Scaling

To scale a service:

```bash
kubectl scale deployment user-service -n e-learning --replicas=3
```

## Monitoring

- Prometheus UI: http://e-learning.local/prometheus
- Grafana Dashboard: http://e-learning.local/grafana (default credentials: admin/admin)
- Zipkin UI: http://e-learning.local/zipkin