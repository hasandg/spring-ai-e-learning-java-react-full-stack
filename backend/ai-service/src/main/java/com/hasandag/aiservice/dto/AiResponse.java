package com.hasandag.aiservice.dto;

import java.time.LocalDateTime;

public class AiResponse {
    
    private String answer;
    private String questionId;
    private LocalDateTime timestamp;
    private String sourceReferences;
    private String courseId;
    private String userId;
    private boolean success = true;
    private String errorMessage;
    
    public AiResponse() {
    }
    
    public AiResponse(String answer, String questionId, LocalDateTime timestamp, String sourceReferences, 
                     String courseId, String userId, boolean success, String errorMessage) {
        this.answer = answer;
        this.questionId = questionId;
        this.timestamp = timestamp;
        this.sourceReferences = sourceReferences;
        this.courseId = courseId;
        this.userId = userId;
        this.success = success;
        this.errorMessage = errorMessage;
    }
    
    // Builder pattern implementation
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private String answer;
        private String questionId;
        private LocalDateTime timestamp;
        private String sourceReferences;
        private String courseId;
        private String userId;
        private boolean success = true;
        private String errorMessage;
        
        public Builder answer(String answer) {
            this.answer = answer;
            return this;
        }
        
        public Builder questionId(String questionId) {
            this.questionId = questionId;
            return this;
        }
        
        public Builder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }
        
        public Builder sourceReferences(String sourceReferences) {
            this.sourceReferences = sourceReferences;
            return this;
        }
        
        public Builder courseId(String courseId) {
            this.courseId = courseId;
            return this;
        }
        
        public Builder userId(String userId) {
            this.userId = userId;
            return this;
        }
        
        public Builder success(boolean success) {
            this.success = success;
            return this;
        }
        
        public Builder errorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
            return this;
        }
        
        public AiResponse build() {
            return new AiResponse(answer, questionId, timestamp, sourceReferences, 
                                courseId, userId, success, errorMessage);
        }
    }
    
    // Getters and Setters
    public String getAnswer() {
        return answer;
    }
    
    public void setAnswer(String answer) {
        this.answer = answer;
    }
    
    public String getQuestionId() {
        return questionId;
    }
    
    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public String getSourceReferences() {
        return sourceReferences;
    }
    
    public void setSourceReferences(String sourceReferences) {
        this.sourceReferences = sourceReferences;
    }
    
    public String getCourseId() {
        return courseId;
    }
    
    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }
    
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
} 