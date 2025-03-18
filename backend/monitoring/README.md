# Backend Monitoring with Prometheus and Grafana

This directory contains configuration files for monitoring the e-learning platform's backend services using Prometheus and Grafana.

## Overview

The monitoring stack includes:

- **Prometheus**: Collects metrics from all Spring Boot services
- **Grafana**: Visualizes metrics in customizable dashboards
- **Node Exporter**: Collects system-level metrics from the host

## Components

- `prometheus.yml`: Configuration for Prometheus to scrape metrics from Spring Boot applications
- `docker-compose.yml`: Docker Compose configuration for the monitoring stack
- `grafana/provisioning/datasources`: Datasource configuration for Grafana
- `grafana/provisioning/dashboards`: Dashboard provisioning configuration
- `grafana/dashboards`: Pre-configured Grafana dashboards

## Setup Instructions

1. Make sure all your Spring Boot applications have the required dependencies:
   - `spring-boot-starter-actuator`
   - `micrometer-registry-prometheus`

2. Ensure each application exposes the Prometheus endpoint in its application properties:
   ```properties
   management.endpoints.web.exposure.include=health,info,prometheus
   management.endpoint.prometheus.enabled=true
   management.metrics.export.prometheus.enabled=true
   management.metrics.tags.application=your-application-name
   ```

3. Start the monitoring stack:
   ```bash
   cd backend/monitoring
   docker-compose up -d
   ```

4. Access the services:
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3000 (default credentials: admin/admin)

## Dashboards

The monitoring stack comes with a pre-configured dashboard:

- **Spring Boot Applications**: Comprehensive dashboard for monitoring Spring Boot services
  - System metrics (CPU, Memory, Disk I/O, Network)
  - JVM metrics (Heap Memory, Non-Heap Memory, GC, Threads)
  - Application metrics (HTTP Request Rate, Response Time, Error Rates)

## Adding Custom Metrics

To add custom metrics to your applications, use the Micrometer API:

```java
@Component
public class CustomMetrics {
    private final MeterRegistry meterRegistry;

    public CustomMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        
        // Register a counter
        Counter.builder("app.requests.total")
              .description("Total number of requests")
              .tag("type", "all")
              .register(meterRegistry);
              
        // Register a gauge
        Gauge.builder("app.queue.size", queue, Queue::size)
             .description("Queue size")
             .register(meterRegistry);
    }
}
```

## Alerts

Alert rules can be added to the Prometheus configuration. For example:

```yaml
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - "alerts.yml"
```

## Additional Services

The monitoring stack can be extended to include:

- **Alertmanager**: For alert notification management
- **cAdvisor**: For container metrics
- **Loki**: For log aggregation 