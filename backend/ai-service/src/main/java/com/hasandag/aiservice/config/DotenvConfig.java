package com.hasandag.aiservice.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import java.io.File;

@Configuration
public class DotenvConfig {
    private static final Logger logger = LoggerFactory.getLogger(DotenvConfig.class);

    @PostConstruct
    public void loadEnv() {
        try {
            // Check if .env file exists
            File envFile = new File(".env");
            if (envFile.exists()) {
                logger.info("Loading environment variables from .env file");
                
                Dotenv dotenv = Dotenv.configure()
                    .directory(".")
                    .ignoreIfMissing()
                    .load();
                
                // Load POE_API_KEY if it exists in .env
                String poeApiKey = dotenv.get("POE_API_KEY");
                if (poeApiKey != null && !poeApiKey.equals("your-poe-api-key-here")) {
                    System.setProperty("POE_API_KEY", poeApiKey);
                    logger.info("POE_API_KEY loaded from .env file");
                }
                
                // Load OPENAI_API_KEY if it exists in .env
                String openaiApiKey = dotenv.get("OPENAI_API_KEY");
                if (openaiApiKey != null && !openaiApiKey.equals("your-openai-api-key-here")) {
                    System.setProperty("OPENAI_API_KEY", openaiApiKey);
                    logger.info("OPENAI_API_KEY loaded from .env file");
                }
            } else {
                logger.warn(".env file not found. Using environment variables or default values.");
            }
        } catch (Exception e) {
            logger.error("Error loading .env file: " + e.getMessage(), e);
        }
    }
} 