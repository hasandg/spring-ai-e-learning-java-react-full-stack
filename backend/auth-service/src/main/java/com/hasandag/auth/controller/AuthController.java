package com.hasandag.auth.controller;

import com.hasandag.auth.domain.User;
import com.hasandag.auth.dto.JwtResponse;
import com.hasandag.auth.dto.LoginRequest;
import com.hasandag.auth.dto.SignupRequest;
import com.hasandag.auth.service.AuthService;
import com.hasandag.common.model.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"}, maxAge = 3600, allowCredentials = "true")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<JwtResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("User authenticated successfully", jwtResponse));
    }
    
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<User>> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        User user = authService.registerUser(signupRequest);
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", user));
    }
    
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("Auth service is up and running", "OK"));
    }
    
    @GetMapping("/test")
    public String test() {
        return "Auth controller test endpoint is working!";
    }
} 