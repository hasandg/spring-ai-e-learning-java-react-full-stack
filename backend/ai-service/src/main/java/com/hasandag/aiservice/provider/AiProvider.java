package com.hasandag.aiservice.provider;

import com.hasandag.aiservice.dto.AiRequest;
import com.hasandag.aiservice.dto.AiResponse;

/**
 * Interface for AI providers (OpenAI, Poe, etc.)
 */
public interface AiProvider {
    
    /**
     * Check if this provider is currently active
     * @return true if active, false otherwise
     */
    boolean isActive();
    
    /**
     * Process a question and generate a response
     * @param request the AI request containing the question and context
     * @return the AI response with the answer
     */
    AiResponse processQuestion(AiRequest request);
    
} 