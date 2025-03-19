package com.hasandag.course.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "progress")
    private Integer progress = 0;

    @Column(name = "status")
    private String status = "ENROLLED";

    @Column(name = "enrollment_date")
    private LocalDateTime enrollmentDate;

    @Column(name = "last_accessed")
    private LocalDateTime lastAccessed;

    @PrePersist
    protected void onCreate() {
        enrollmentDate = LocalDateTime.now();
        lastAccessed = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastAccessed = LocalDateTime.now();
    }
} 