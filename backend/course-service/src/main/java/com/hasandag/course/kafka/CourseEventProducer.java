package com.hasandag.course.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    private static final String COURSE_EVENTS_TOPIC = "course-events";
    private static final String ENROLLMENT_EVENTS_TOPIC = "enrollment-events";
    
    public void publishCourseCreated(CourseEvent event) {
        log.info("Publishing course created event: {}", event);
        kafkaTemplate.send(COURSE_EVENTS_TOPIC, event.getCourseId(), event);
    }
    
    public void publishCourseUpdated(CourseEvent event) {
        log.info("Publishing course updated event: {}", event);
        kafkaTemplate.send(COURSE_EVENTS_TOPIC, event.getCourseId(), event);
    }
    
    public void publishCourseDeleted(CourseEvent event) {
        log.info("Publishing course deleted event: {}", event);
        kafkaTemplate.send(COURSE_EVENTS_TOPIC, event.getCourseId(), event);
    }
    
    public void publishEnrollment(EnrollmentEvent event) {
        log.info("Publishing enrollment event: {}", event);
        kafkaTemplate.send(ENROLLMENT_EVENTS_TOPIC, event.getUserId(), event);
    }
} 