package com.hasandag.aiservice.service;

import com.hasandag.aiservice.dto.AiRequest;
import com.hasandag.aiservice.dto.AiResponse;
import com.hasandag.aiservice.provider.MockProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AiServiceTest {

    private AiService aiService;

    @Mock
    private MockProvider mockProvider;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Set up the mock provider to be active
        when(mockProvider.isActive()).thenReturn(true);
        
        // Create response for the mock provider
        AiResponse mockResponse = AiResponse.builder()
                .answer("This is a test response")
                .questionId("test-id")
                .success(true)
                .build();
        when(mockProvider.processQuestion(any(AiRequest.class))).thenReturn(mockResponse);
        
        // Initialize the service with only the mock provider
        aiService = new AiService(Collections.singletonList(mockProvider), mockProvider);
        
        // Set the configured provider to "mock"
        ReflectionTestUtils.setField(aiService, "configuredProvider", "mock");
    }

    @Test
    void testProcessQuestion_Success() {
        // Arrange
        AiRequest request = new AiRequest();
        request.setQuestion("What is Spring Boot?");
        request.setCourseId("course-123");
        request.setUserId("user-456");

        // Act
        AiResponse response = aiService.processQuestion(request);

        // Assert
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("This is a test response", response.getAnswer());
        assertEquals("test-id", response.getQuestionId());
    }

    @Test
    void testProcessQuestion_WithExceptionThrown() {
        // Arrange
        AiRequest request = new AiRequest();
        request.setQuestion("What is Spring Boot?");
        
        // Setup the mock to throw an exception
        when(mockProvider.processQuestion(any(AiRequest.class))).thenThrow(new RuntimeException("Test exception"));

        // Act
        AiResponse response = aiService.processQuestion(request);

        // Assert
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertNotNull(response.getErrorMessage());
        assertTrue(response.getErrorMessage().contains("Test exception"));
    }
} 