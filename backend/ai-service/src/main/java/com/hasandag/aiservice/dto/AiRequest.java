package com.hasandag.aiservice.dto;

import jakarta.validation.constraints.NotBlank;

public class AiRequest {
    
    @NotBlank(message = "Question is required")
    private String question;
    
    private String courseId;
    
    private String userId;
    
    private String context;
    
    public AiRequest() {
    }
    
    public AiRequest(@NotBlank(message = "Question is required") String question, String courseId, String userId, String context) {
        this.question = question;
        this.courseId = courseId;
        this.userId = userId;
        this.context = context;
    }
    
    public String getQuestion() {
        return question;
    }
    
    public void setQuestion(String question) {
        this.question = question;
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
    
    public String getContext() {
        return context;
    }
    
    public void setContext(String context) {
        this.context = context;
    }
    
    @Override
    public String toString() {
        return "AiRequest{" +
                "question='" + question + '\'' +
                ", courseId='" + courseId + '\'' +
                ", userId='" + userId + '\'' +
                ", context='" + context + '\'' +
                '}';
    }
} 