package com.hasandag.course.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDto {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String level;
    private BigDecimal price;
    private String imageUrl;
    private Long instructorId;
    private String instructorName; // This may be populated by user service
    private Integer progress; // This represents user progress, populated for each user
    private Double averageRating; // This may be populated from rating service
    private Integer enrollmentCount; // This may be populated from enrollment service
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 