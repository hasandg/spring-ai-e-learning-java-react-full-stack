package com.hasandag.auth.service;

import com.hasandag.auth.domain.Role;
import com.hasandag.auth.domain.User;
import com.hasandag.auth.dto.JwtResponse;
import com.hasandag.auth.dto.LoginRequest;
import com.hasandag.auth.dto.SignupRequest;
import com.hasandag.auth.repository.RoleRepository;
import com.hasandag.auth.repository.UserRepository;
import com.hasandag.common.exception.ResourceNotFoundException;
import com.hasandag.common.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken(authentication.getName());
        
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", loginRequest.getUsername()));
        
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        
        return new JwtResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), roles);
    }
    
    @Transactional
    public User registerUser(SignupRequest signupRequest) {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }
        
        User user = User.builder()
                .username(signupRequest.getUsername())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .firstName(signupRequest.getFirstName())
                .lastName(signupRequest.getLastName())
                .enabled(true)
                .build();
        
        Set<String> strRoles = signupRequest.getRoles();
        Set<Role> roles = new HashSet<>();
        
        if (strRoles == null || strRoles.isEmpty()) {
            addRoleToUser(roles, "ROLE_USER");
        } else {
            strRoles.forEach(role -> {
                String roleName;
                switch (role) {
                    case "admin", "ADMIN", "ROLE_ADMIN":
                        roleName = "ROLE_ADMIN";
                        break;
                    case "instructor", "INSTRUCTOR", "ROLE_INSTRUCTOR":
                        roleName = "ROLE_INSTRUCTOR";
                        break;
                    case "moderator", "MODERATOR", "ROLE_MODERATOR":
                        roleName = "ROLE_MODERATOR";
                        break;
                    case "user", "USER", "ROLE_USER":
                    default:
                        roleName = "ROLE_USER";
                        break;
                }
                addRoleToUser(roles, roleName);
            });
        }
        
        user.setRoles(roles);
        return userRepository.save(user);
    }
    
    private void addRoleToUser(Set<Role> roles, String roleName) {
        try {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleName));
            roles.add(role);
        } catch (ResourceNotFoundException e) {
            Role newRole = new Role();
            newRole.setName(roleName);
            roles.add(roleRepository.save(newRole));
        }
    }
} 