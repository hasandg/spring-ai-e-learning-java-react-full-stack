package com.hasandag.course.service;

import com.hasandag.course.model.Course;
import com.hasandag.course.repository.CourseRepository;
import com.hasandag.course.kafka.CourseEvent;
import com.hasandag.course.kafka.CourseEventProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseEventProducer courseEventProducer;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    @Transactional
    public Course createCourse(Course course) {
        Course savedCourse = courseRepository.save(course);
        
        // Publish course created event
        CourseEvent courseEvent = CourseEvent.builder()
                .courseId(savedCourse.getId().toString())
                .title(savedCourse.getTitle())
                .instructorId(savedCourse.getInstructorId().toString())
                .eventType(CourseEvent.EventType.CREATED)
                .timestamp(LocalDateTime.now())
                .build();
        
        courseEventProducer.publishCourseCreated(courseEvent);
        
        return savedCourse;
    }

    @Transactional
    public Optional<Course> updateCourse(Long id, Course courseDetails) {
        return courseRepository.findById(id)
                .map(existingCourse -> {
                    existingCourse.setTitle(courseDetails.getTitle());
                    existingCourse.setDescription(courseDetails.getDescription());
                    existingCourse.setCategory(courseDetails.getCategory());
                    existingCourse.setLevel(courseDetails.getLevel());
                    existingCourse.setPrice(courseDetails.getPrice());
                    existingCourse.setImageUrl(courseDetails.getImageUrl());
                    
                    Course updatedCourse = courseRepository.save(existingCourse);
                    
                    // Publish course updated event
                    CourseEvent courseEvent = CourseEvent.builder()
                            .courseId(updatedCourse.getId().toString())
                            .title(updatedCourse.getTitle())
                            .instructorId(updatedCourse.getInstructorId().toString())
                            .eventType(CourseEvent.EventType.UPDATED)
                            .timestamp(LocalDateTime.now())
                            .build();
                    
                    courseEventProducer.publishCourseUpdated(courseEvent);
                    
                    return updatedCourse;
                });
    }

    @Transactional
    public boolean deleteCourse(Long id) {
        return courseRepository.findById(id)
                .map(course -> {
                    courseRepository.delete(course);
                    
                    // Publish course deleted event
                    CourseEvent courseEvent = CourseEvent.builder()
                            .courseId(course.getId().toString())
                            .title(course.getTitle())
                            .instructorId(course.getInstructorId().toString())
                            .eventType(CourseEvent.EventType.DELETED)
                            .timestamp(LocalDateTime.now())
                            .build();
                    
                    courseEventProducer.publishCourseDeleted(courseEvent);
                    
                    return true;
                })
                .orElse(false);
    }

    public List<Course> getCoursesByInstructorId(Long instructorId) {
        return courseRepository.findByInstructorId(instructorId);
    }

    public List<Course> getCoursesByCategory(String category) {
        return courseRepository.findByCategory(category);
    }

    public List<Course> getCoursesByLevel(String level) {
        return courseRepository.findByLevel(level);
    }

    public List<Course> searchCoursesByTitle(String keyword) {
        return courseRepository.findByTitleContainingIgnoreCase(keyword);
    }
} 