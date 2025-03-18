package com.hasandag.auth.config;

import com.hasandag.auth.domain.Role;
import com.hasandag.auth.repository.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(RoleInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        logger.info("Initializing roles...");
        
        initRole("ROLE_USER");
        initRole("ROLE_ADMIN");
        initRole("ROLE_INSTRUCTOR");
        initRole("ROLE_MODERATOR");
        
        logger.info("Roles initialization completed");
    }
    
    private void initRole(String roleName) {
        if (roleRepository.findByName(roleName).isEmpty()) {
            Role role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
            logger.info("Created role: {}", roleName);
        } else {
            logger.info("Role already exists: {}", roleName);
        }
    }
} 