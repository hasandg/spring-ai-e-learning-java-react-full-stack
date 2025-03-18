package com.hasandag.course.mapper;

import com.hasandag.course.dto.CourseDto;
import com.hasandag.course.model.Course;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CourseMapper {

    public CourseDto toDto(Course course) {
        return CourseDto.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .category(course.getCategory())
                .level(course.getLevel())
                .price(course.getPrice())
                .imageUrl(course.getImageUrl())
                .instructorId(course.getInstructorId())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                // Default values for fields that might be populated from other services
                .progress(0)
                .averageRating(0.0)
                .enrollmentCount(0)
                .build();
    }

    public List<CourseDto> toDtoList(List<Course> courses) {
        return courses.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Course toEntity(CourseDto courseDto) {
        return Course.builder()
                .id(courseDto.getId())
                .title(courseDto.getTitle())
                .description(courseDto.getDescription())
                .category(courseDto.getCategory())
                .level(courseDto.getLevel())
                .price(courseDto.getPrice())
                .imageUrl(courseDto.getImageUrl())
                .instructorId(courseDto.getInstructorId())
                .createdAt(courseDto.getCreatedAt())
                .updatedAt(courseDto.getUpdatedAt())
                .build();
    }
} 