package com.hasandag.aiservice.service;

import com.hasandag.aiservice.dto.AiRequest;
import com.hasandag.aiservice.dto.AiResponse;
import com.hasandag.aiservice.provider.AiProvider;
import com.hasandag.aiservice.provider.MockProvider;
import com.hasandag.aiservice.util.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AiService {
    
    private static final org.slf4j.Logger log = Logger.getLogger(AiService.class);

    @Value("${ai.provider}")
    private String configuredProvider;
    
    private final List<AiProvider> providers;
    private final MockProvider mockProvider;

    @Autowired
    public AiService(List<AiProvider> providers, MockProvider mockProvider) {
        this.providers = providers;
        this.mockProvider = mockProvider;
    }
    
    public AiResponse processQuestion(AiRequest request) {
        log.info("Processing AI request for user: {}, course: {}", request.getUserId(), request.getCourseId());
        
        try {
            // Find the active provider
            AiProvider activeProvider = providers.stream()
                    .filter(AiProvider::isActive)
                    .findFirst()
                    .orElse(mockProvider); // Use mock provider as fallback
            
            log.info("Using AI provider: {}", activeProvider.getClass().getSimpleName());
            
            return activeProvider.processQuestion(request);
        } catch (Exception e) {
            log.error("Error processing AI request", e);
            return AiResponse.builder()
                    .success(false)
                    .errorMessage("Failed to process AI request: " + e.getMessage())
                    .timestamp(LocalDateTime.now())
                    .build();
        }
    }
} 