package com.hasandag.aiservice.util;

import org.slf4j.LoggerFactory;

/**
 * A utility class for logging that replaces @Slf4j annotations
 */
public class Logger {
    public static org.slf4j.Logger getLogger(Class<?> clazz) {
        return LoggerFactory.getLogger(clazz);
    }
} 