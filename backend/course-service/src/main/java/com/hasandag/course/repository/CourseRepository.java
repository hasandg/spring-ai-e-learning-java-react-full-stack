package com.hasandag.course.repository;

import com.hasandag.course.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    List<Course> findByInstructorId(Long instructorId);
    
    List<Course> findByCategory(String category);
    
    List<Course> findByLevel(String level);
    
    List<Course> findByTitleContainingIgnoreCase(String keyword);
} 