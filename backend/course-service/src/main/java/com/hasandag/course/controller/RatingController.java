package com.hasandag.course.controller;

import com.hasandag.course.model.Rating;
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
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final CourseService courseService;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Rating>> getCourseRatings(@PathVariable Long courseId) {
        List<Rating> ratings = courseService.getCourseRatings(courseId);
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("/course/{courseId}/average")
    public ResponseEntity<Map<String, Double>> getAverageRating(@PathVariable Long courseId) {
        Double averageRating = courseService.getAverageRatingForCourse(courseId);
        return ResponseEntity.ok(Map.of("averageRating", averageRating != null ? averageRating : 0.0));
    }

    @PostMapping("/rate")
    public ResponseEntity<Rating> rateCourse(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody Map<String, Object> request) {
        
        String userId = jwt.getSubject();
        Long courseId = Long.parseLong(request.get("courseId").toString());
        Integer rating = Integer.parseInt(request.get("rating").toString());
        String comment = (String) request.get("comment");
        
        Rating courseRating = courseService.rateCourse(
                Long.parseLong(userId),
                courseId,
                rating,
                comment);
                
        return ResponseEntity.status(HttpStatus.CREATED).body(courseRating);
    }
} 