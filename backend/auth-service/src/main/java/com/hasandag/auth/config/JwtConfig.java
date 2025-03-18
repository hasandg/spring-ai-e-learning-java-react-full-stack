package com.hasandag.auth.config;

import com.hasandag.common.security.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for JWT related beans.
 * This ensures that the JwtUtil from the common library is properly registered as a bean.
 */
@Configuration
public class JwtConfig {

    @Bean
    public JwtUtil jwtUtil() {
        return new JwtUtil();
    }
} 