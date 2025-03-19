package com.hasandag.course.repository;

import com.hasandag.course.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    List<Enrollment> findByCourseId(Long courseId);
    
    List<Enrollment> findByUserId(Long userId);
    
    Optional<Enrollment> findByUserIdAndCourseId(Long userId, Long courseId);
    
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.courseId = ?1")
    Integer countByCourseId(Long courseId);
    
    @Query("SELECT AVG(e.progress) FROM Enrollment e WHERE e.courseId = ?1")
    Double getAverageProgressForCourse(Long courseId);
} 