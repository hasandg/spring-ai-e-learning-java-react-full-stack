package com.hasandag.aiservice.controller;

import com.hasandag.aiservice.dto.AiRequest;
import com.hasandag.aiservice.dto.AiResponse;
import com.hasandag.aiservice.service.AiService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AiController.class)
class AiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AiService aiService;

    @Test
    void testHealth() throws Exception {
        mockMvc.perform(get("/api/v1/ai/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("AI Service is running"));
    }

    @Test
    void testAsk() throws Exception {
        // Arrange
        AiResponse mockResponse = AiResponse.builder()
                .answer("Spring Boot is a framework...")
                .questionId(UUID.randomUUID().toString())
                .timestamp(LocalDateTime.now())
                .sourceReferences("Documentation")
                .courseId("course-123")
                .userId("user-456")
                .success(true)
                .build();

        when(aiService.processQuestion(any(AiRequest.class))).thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(post("/api/v1/ai/ask")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"question\":\"What is Spring Boot?\",\"courseId\":\"course-123\",\"userId\":\"user-456\"}"))
                .andExpect(status().isOk());
    }
} 