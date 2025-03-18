package com.hasandag.aiservice.config;

import com.hasandag.aiservice.util.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Configuration
public class AiConfig {
    
    private static final org.slf4j.Logger log = Logger.getLogger(AiConfig.class);
    
    /**
     * Provides a WebClient bean for HTTP requests
     */
    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder()
                .filter(logRequest())
                .filter(logResponse());
    }
    
    /**
     * Log request details for debugging
     */
    private ExchangeFilterFunction logRequest() {
        return ExchangeFilterFunction.ofRequestProcessor(clientRequest -> {
            log.debug("Request: {} {}", clientRequest.method(), clientRequest.url());
            clientRequest.headers().forEach((name, values) -> {
                if (!name.equalsIgnoreCase("Authorization")) {
                    values.forEach(value -> log.debug("{}={}", name, value));
                } else {
                    log.debug("{}=*****", name);
                }
            });
            return Mono.just(clientRequest);
        });
    }
    
    /**
     * Log response details for debugging
     */
    private ExchangeFilterFunction logResponse() {
        return ExchangeFilterFunction.ofResponseProcessor(clientResponse -> {
            log.debug("Response status: {}", clientResponse.statusCode());
            return Mono.just(clientResponse);
        });
    }
} 