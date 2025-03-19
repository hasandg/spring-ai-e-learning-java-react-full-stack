package com.hasandag.course.controller;

import com.hasandag.course.model.Enrollment;
import com.hasandag.course.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final CourseService courseService;

    @GetMapping("/user")
    public ResponseEntity<List<Enrollment>> getUserEnrollments(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        List<Enrollment> enrollments = courseService.getUserEnrollments(Long.parseLong(userId));
        return ResponseEntity.ok(enrollments);
    }

    @PostMapping("/enroll")
    public ResponseEntity<Enrollment> enrollInCourse(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody Map<String, Long> request) {
        
        String userId = jwt.getSubject();
        Long courseId = request.get("courseId");
        
        Enrollment enrollment = courseService.enrollUserInCourse(
                Long.parseLong(userId),
                courseId);
                
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollment);
    }

    @PutMapping("/progress")
    public ResponseEntity<Enrollment> updateProgress(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody Map<String, Object> request) {
        
        String userId = jwt.getSubject();
        Long courseId = Long.parseLong(request.get("courseId").toString());
        Integer progress = Integer.parseInt(request.get("progress").toString());
        
        return courseService.updateEnrollmentProgress(
                Long.parseLong(userId),
                courseId,
                progress)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 