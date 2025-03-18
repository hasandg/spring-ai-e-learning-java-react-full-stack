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
public class EnrollmentEvent {
    
    private String userId;
    private String courseId;
    private String courseName;
    private EnrollmentStatus status;
    private LocalDateTime timestamp;
    
    public enum EnrollmentStatus {
        ENROLLED,
        UNENROLLED,
        COMPLETED
    }
} 