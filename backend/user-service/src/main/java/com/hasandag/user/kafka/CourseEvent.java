package com.hasandag.user.kafka;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseEvent {
    
    private String courseId;
    private String title;
    private String instructorId;
    private EventType eventType;
    private LocalDateTime timestamp;
    
    public enum EventType {
        CREATED,
        UPDATED,
        DELETED
    }
} 