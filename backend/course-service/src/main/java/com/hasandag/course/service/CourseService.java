package com.hasandag.course.service;

import com.hasandag.course.model.Course;
import com.hasandag.course.model.Enrollment;
import com.hasandag.course.model.Rating;
import com.hasandag.course.repository.CourseRepository;
import com.hasandag.course.repository.EnrollmentRepository;
import com.hasandag.course.repository.RatingRepository;
import com.hasandag.course.kafka.CourseEvent;
import com.hasandag.course.kafka.CourseEventProducer;
import com.hasandag.course.dto.CourseDto;
import com.hasandag.course.mapper.CourseMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final RatingRepository ratingRepository;
    private final CourseEventProducer courseEventProducer;
    private final CourseMapper courseMapper;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    public List<CourseDto> getAllCoursesWithDetails() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream()
                .map(course -> {
                    CourseDto dto = courseMapper.toDto(course);
                    
                    // Enhance with additional details
                    Integer enrollmentCount = enrollmentRepository.countByCourseId(course.getId());
                    Double averageRating = ratingRepository.getAverageRatingForCourse(course.getId());
                    
                    dto.setEnrollmentCount(enrollmentCount);
                    dto.setAverageRating(averageRating);
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    public CourseDto getCourseWithDetails(Long courseId, Long userId) {
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        
        if (!courseOpt.isPresent()) {
            return null;
        }
        
        Course course = courseOpt.get();
        CourseDto dto = courseMapper.toDto(course);
        
        // Add enrollment count and average rating
        Integer enrollmentCount = enrollmentRepository.countByCourseId(courseId);
        Double averageRating = ratingRepository.getAverageRatingForCourse(courseId);
        
        dto.setEnrollmentCount(enrollmentCount);
        dto.setAverageRating(averageRating);
        
        // Add user-specific progress if available
        if (userId != null) {
            Optional<Enrollment> enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
            enrollment.ifPresent(e -> dto.setProgress(e.getProgress()));
        }
        
        return dto;
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
    
    // Enrollment methods
    
    public List<Enrollment> getUserEnrollments(Long userId) {
        return enrollmentRepository.findByUserId(userId);
    }
    
    @Transactional
    public Enrollment enrollUserInCourse(Long userId, Long courseId) {
        Optional<Enrollment> existingEnrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
        
        if (existingEnrollment.isPresent()) {
            return existingEnrollment.get();
        }
        
        Enrollment enrollment = Enrollment.builder()
                .userId(userId)
                .courseId(courseId)
                .progress(0)
                .status("ENROLLED")
                .build();
                
        return enrollmentRepository.save(enrollment);
    }
    
    @Transactional
    public Optional<Enrollment> updateEnrollmentProgress(Long userId, Long courseId, Integer progress) {
        return enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .map(enrollment -> {
                    enrollment.setProgress(progress);
                    enrollment.setLastAccessed(LocalDateTime.now());
                    return enrollmentRepository.save(enrollment);
                });
    }
    
    // Rating methods
    
    public List<Rating> getCourseRatings(Long courseId) {
        return ratingRepository.findByCourseId(courseId);
    }
    
    @Transactional
    public Rating rateCourse(Long userId, Long courseId, Integer rating, String comment) {
        Optional<Rating> existingRating = ratingRepository.findByUserIdAndCourseId(userId, courseId);
        
        if (existingRating.isPresent()) {
            Rating updateRating = existingRating.get();
            updateRating.setRating(rating);
            updateRating.setComment(comment);
            return ratingRepository.save(updateRating);
        }
        
        Rating newRating = Rating.builder()
                .userId(userId)
                .courseId(courseId)
                .rating(rating)
                .comment(comment)
                .build();
                
        return ratingRepository.save(newRating);
    }
    
    public Double getAverageRatingForCourse(Long courseId) {
        return ratingRepository.getAverageRatingForCourse(courseId);
    }
} 