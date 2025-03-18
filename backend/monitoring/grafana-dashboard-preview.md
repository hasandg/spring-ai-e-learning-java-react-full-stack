# Grafana Dashboard for E-Learning Platform Backend

This document provides an overview of the Grafana dashboard setup for monitoring the e-learning platform's backend services.

## Dashboard Overview

The Spring Boot Applications dashboard provides comprehensive monitoring for all Spring Boot services in the e-learning platform, including:

- Course Service
- User Service
- AI Service
- Gateway Service

The dashboard is organized into three main sections:

1. **System Overview**: System-level metrics
2. **JVM Metrics**: Java Virtual Machine performance metrics
3. **Application Metrics**: Service-specific application metrics

## Dashboard Sections

### System Overview

This section provides insights into the host system performance:

- **CPU Usage**: Real-time CPU utilization across all cores
- **Memory Usage**: Current memory consumption and available memory
- **Disk I/O**: Read and write operations per second
- **Network Traffic**: Inbound and outbound network traffic

[System Overview Screenshot Placeholder]

### JVM Metrics

This section focuses on the Java Virtual Machine performance for each service:

- **JVM Heap Memory**: Used and committed heap memory
- **JVM Non-Heap Memory**: Used and committed non-heap memory
- **GC Pause Total Time**: Garbage collection pause duration
- **JVM Thread States**: Thread count by state (runnable, waiting, timed-waiting, blocked)

[JVM Metrics Screenshot Placeholder]

### Application Metrics

This section provides application-specific metrics for each service:

- **HTTP Request Rate**: Requests per second by endpoint and status code
- **HTTP Response Time**: 95th and 50th percentile response times by endpoint
- **Total 5xx Errors**: Count of server error responses
- **HTTP Status Codes**: Distribution of HTTP status codes

[Application Metrics Screenshot Placeholder]

## Service-Specific Metrics

### AI Service Metrics

The AI Service dashboard includes specialized panels for monitoring AI-specific metrics:

- **AI Provider Usage**: Requests per provider (OpenAI, Poe, Copilot)
- **AI Response Time**: Response time by provider and operation
- **AI Error Rate**: Errors by provider and error type
- **Token Usage**: Token consumption metrics for monitoring API limits

[AI Service Metrics Screenshot Placeholder]

## How to Access

1. Start the monitoring stack:
   ```bash
   cd backend/monitoring
   docker-compose up -d
   ```

2. Access Grafana at http://localhost:3000 (default credentials: admin/admin)

3. Navigate to the "Spring Boot Applications" dashboard from the dashboard list or home page

## Adding Custom Metrics

The dashboard can be extended with custom metrics by:

1. Adding new metrics collection in your Spring Boot services
2. Updating the Prometheus configuration to scrape the new metrics
3. Adding new panels to the Grafana dashboard

## Best Practices

- Review the dashboard regularly to identify performance bottlenecks
- Set up alerts for critical metrics to receive notifications when thresholds are exceeded
- Add custom metrics for business-specific KPIs
- Consider using Grafana annotations to mark deployments and other significant events 