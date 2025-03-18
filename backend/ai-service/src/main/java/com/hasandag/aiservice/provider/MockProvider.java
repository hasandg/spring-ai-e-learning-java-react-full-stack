package com.hasandag.aiservice.provider;

import com.hasandag.aiservice.dto.AiRequest;
import com.hasandag.aiservice.dto.AiResponse;
import com.hasandag.aiservice.util.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class MockProvider implements AiProvider {
    private static final org.slf4j.Logger log = Logger.getLogger(MockProvider.class);

    @Value("${ai.provider}")
    private String activeProvider;

    @Override
    public boolean isActive() {
        return "mock".equalsIgnoreCase(activeProvider);
    }

    @Override
    public AiResponse processQuestion(AiRequest request) {
        log.info("Processing question with Mock provider: {}", request.getQuestion());
        
        // Create a simulated response based on the question
        String answer = generateMockAnswer(request.getQuestion(), request.getCourseId(), request.getContext());
        
        return AiResponse.builder()
                .answer(answer)
                .questionId(UUID.randomUUID().toString())
                .timestamp(LocalDateTime.now())
                .sourceReferences("Mock AI response - for testing only")
                .courseId(request.getCourseId())
                .userId(request.getUserId())
                .success(true)
                .build();
    }
    
    private String generateMockAnswer(String question, String courseId, String context) {
        StringBuilder response = new StringBuilder();
        
        response.append("This is a mock AI response to your question: \"")
                .append(question)
                .append("\".\n\n");
        
        if (courseId != null && !courseId.isEmpty()) {
            response.append("For course ID: ").append(courseId).append(".\n\n");
        }
        
        if (context != null && !context.isEmpty()) {
            response.append("Based on the context you provided: ").append(context).append(".\n\n");
        }
        
        response.append("In a production environment, this would be answered by a real AI model like OpenAI or Poe.\n")
                .append("Note: This is only a mock response for testing or when no AI provider is available.");
        
        return response.toString();
    }
} 