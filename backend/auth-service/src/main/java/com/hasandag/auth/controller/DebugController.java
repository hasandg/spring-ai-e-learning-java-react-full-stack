package com.hasandag.auth.controller;

import org.springframework.web.bind.annotation.*;

/**
 * Controller for debugging purposes only.
 * This should be removed in production.
 */
@RestController
@RequestMapping("/debug")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DebugController {
    
    @GetMapping("/ping")
    public String ping() {
        return "Pong! Debug controller is working.";
    }
    
    @PostMapping("/echo")
    public String echo(@RequestBody(required = false) String body) {
        return "Received: " + (body != null ? body : "no body");
    }
} 