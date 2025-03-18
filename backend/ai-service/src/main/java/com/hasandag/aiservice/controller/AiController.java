package com.hasandag.aiservice.controller;

import com.hasandag.aiservice.dto.AiRequest;
import com.hasandag.aiservice.dto.AiResponse;
import com.hasandag.aiservice.service.AiService;
import com.hasandag.aiservice.util.Logger;
import jakarta.validation.Valid;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {
    
    private static final org.slf4j.Logger log = Logger.getLogger(AiController.class);
    
    private final AiService aiService;
    
    public AiController(AiService aiService) {
        this.aiService = aiService;
    }
    
    @PostMapping("/ask")
    public ResponseEntity<AiResponse> ask(@Valid @RequestBody AiRequest request) {
        log.info("Received AI request: {}", request);
        AiResponse response = aiService.processQuestion(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        log.info("Health check requested");
        return ResponseEntity.ok("AI Service is running");
    }
} 