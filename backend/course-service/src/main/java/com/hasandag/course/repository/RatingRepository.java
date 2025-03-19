package com.hasandag.course.repository;

import com.hasandag.course.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    List<Rating> findByCourseId(Long courseId);
    
    List<Rating> findByUserId(Long userId);
    
    Optional<Rating> findByUserIdAndCourseId(Long userId, Long courseId);
    
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.courseId = ?1")
    Double getAverageRatingForCourse(Long courseId);
    
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.courseId = ?1")
    Integer countByCourseId(Long courseId);
} 