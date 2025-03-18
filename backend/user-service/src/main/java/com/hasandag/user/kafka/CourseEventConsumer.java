package com.hasandag.user.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseEventConsumer {

    @KafkaListener(topics = "course-events", groupId = "user-service-group")
    public void consumeCourseEvent(CourseEvent event) {
        log.info("Received course event: {}", event);
        // Process course event - update user's course catalog, etc.
        switch (event.getEventType()) {
            case CREATED:
                log.info("Processing course creation: {}", event.getTitle());
                break;
            case UPDATED:
                log.info("Processing course update: {}", event.getTitle());
                break;
            case DELETED:
                log.info("Processing course deletion: {}", event.getCourseId());
                break;
            default:
                log.warn("Unknown event type: {}", event.getEventType());
        }
    }

    @KafkaListener(topics = "enrollment-events", groupId = "user-service-group")
    public void consumeEnrollmentEvent(EnrollmentEvent event) {
        log.info("Received enrollment event: {}", event);
        // Process enrollment event - update user's enrollments, etc.
        switch (event.getStatus()) {
            case ENROLLED:
                log.info("User {} enrolled in course {}", event.getUserId(), event.getCourseName());
                break;
            case UNENROLLED:
                log.info("User {} unenrolled from course {}", event.getUserId(), event.getCourseName());
                break;
            case COMPLETED:
                log.info("User {} completed course {}", event.getUserId(), event.getCourseName());
                break;
            default:
                log.warn("Unknown enrollment status: {}", event.getStatus());
        }
    }
} 