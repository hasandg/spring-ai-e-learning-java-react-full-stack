# Migrating from Eureka to Kubernetes for Service Discovery

This guide outlines the steps needed to migrate from Netflix Eureka to Kubernetes for service discovery in the E-Learning Platform.

## Why Migrate?

Kubernetes provides several advantages over Eureka for service discovery:

1. **Unified platform**: Orchestration, deployment, scaling, and service discovery in one system
2. **Richer features**: Load balancing, self-healing, rolling updates, autoscaling
3. **Industry standard**: Widely adopted with extensive tooling and documentation
4. **Simplified architecture**: No need for a separate service discovery component

## Migration Steps

### 1. Update Dependencies

For each microservice, update the `pom.xml` file:

#### Remove Eureka Dependencies

```xml
<!-- Remove this -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

#### Add Kubernetes Dependencies

```xml
<!-- Add these dependencies -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-kubernetes-client</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-kubernetes-client-loadbalancer</artifactId>
</dependency>
```

### 2. Update Application Configuration

For each microservice, update the configuration:

#### Before (application.yml with Eureka)

```yaml
eureka:
  client:
    serviceUrl:
      defaultZone: http://discovery-service:8761/eureka/
  instance:
    preferIpAddress: true
```

#### After (application.yml with Kubernetes)

```yaml
spring:
  cloud:
    kubernetes:
      discovery:
        all-namespaces: false
      loadbalancer:
        mode: service
```

### 3. Update Service Communication

#### Before (with Eureka)

```java
@FeignClient(name = "user-service")
public interface UserServiceClient {
    // ...
}
```

#### After (with Kubernetes)

```java
@FeignClient(name = "user-service")
public interface UserServiceClient {
    // ...
}
```

The code remains the same, but the service resolution happens through Kubernetes services instead of Eureka.

### 4. Create Kubernetes Resources

Create the following Kubernetes resources for each service:

1. **Deployment**: Manages the pods running the service
2. **Service**: Creates a stable endpoint for service discovery
3. **ConfigMap**: Stores configuration data
4. **Secret**: Stores sensitive data
5. **PersistentVolumeClaim**: For stateful services

### 5. Configure Health Checks

Add Kubernetes liveness and readiness probes:

```yaml
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 60
  periodSeconds: 20
readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
```

### 6. Deploy to Kubernetes

Deploy the application to Kubernetes:

```bash
kubectl apply -k ./
```

### 7. Remove Eureka Server

Once all services are successfully migrated:

1. Remove the Eureka server deployment
2. Remove Eureka server code and configuration

## Testing the Migration

1. Verify all services are registered correctly:
   ```bash
   kubectl get services -n e-learning
   ```

2. Test inter-service communication:
   ```bash
   kubectl exec -it <pod-name> -n e-learning -- curl <service-name>.<namespace>.svc.cluster.local:<port>
   ```

3. Verify client-side load balancing:
   ```bash
   kubectl scale deployment <service-name> -n e-learning --replicas=3
   ```
   Then check if requests are distributed across instances.

## Rollback Plan

If issues arise during migration:

1. Redeploy the Eureka server
2. Revert the code changes in each microservice
3. Rebuild and deploy the microservices with Eureka client dependencies
4. Verify services register with Eureka correctly

## Conclusion

Migrating from Eureka to Kubernetes for service discovery streamlines the architecture and leverages Kubernetes' native capabilities for service management, resulting in a more resilient and maintainable system. 