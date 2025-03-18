package com.hasandag.common.dto;

import java.time.LocalDateTime;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String name;
    private boolean enabled;
    private Set<String> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Additional fields for profile information
    private String profileImageUrl;
    private String bio;
    private String phoneNumber;
    private String address;
    private String country;
    private String language;
    private String timezone;
    
    // Learning progress related fields
    private Integer completedCourses;
    private Integer enrolledCourses;
    private Double averageRating;
    private Integer certificatesEarned;
} 