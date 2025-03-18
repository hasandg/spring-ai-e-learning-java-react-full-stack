package com.hasandag.auth.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for service discovery.
 * This class explicitly configures service discovery for Kubernetes.
 */
@Configuration
@EnableDiscoveryClient
@ConditionalOnProperty(value = "spring.cloud.kubernetes.enabled", matchIfMissing = true)
public class ServiceDiscoveryConfig {
    // Configuration is done through properties
} 