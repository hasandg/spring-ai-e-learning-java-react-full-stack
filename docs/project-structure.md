# E-Learning Platform Project Structure

This document outlines the structure of the E-Learning Platform project, explaining the organization of the codebase and the purpose of each component.

## Overview

The E-Learning Platform is organized into two main directories:

1. `backend/` - Contains all the microservices and backend infrastructure
2. `frontend/` - Contains the React frontend application

## Backend Structure

The backend follows a microservices architecture with the following components:

### Microservices

- **API Gateway** (`api-gateway/`): Entry point for all client requests, handles routing to appropriate microservices
- **Auth Service** (`auth-service/`): Handles user authentication and authorization using JWT
- **User Service** (`user-service/`): Manages user profiles and permissions
- **Course Service** (`course-service/`): Handles course creation, enrollment, and management
- **Video Service** (`video-service/`): Manages video streaming and processing

### Shared Components

- **Common Library** (`common-lib/`): Shared code and utilities used across services
  - Exception handling
  - Security utilities
  - Common DTOs
  - Validation utilities

### Infrastructure

- **Docker Compose** (`docker-compose.yml`): Container orchestration for local development
- **Prometheus** (`prometheus/`): Metrics collection configuration
- **Logstash** (`logstash/`): Log processing configuration
- **Database Initialization** (`init-db.sql`): Initial database setup scripts

## Frontend Structure

The frontend is a React application with TypeScript, organized as follows:

### Core Directories

- **components/**: Reusable UI components
  - **common/**: Shared components like buttons, inputs, etc.
  - **layouts/**: Page layout components
- **pages/**: Page components corresponding to routes
- **services/**: API service calls
- **store/**: Redux store setup and slices
- **hooks/**: Custom React hooks
- **utils/**: Utility functions
- **types/**: TypeScript type definitions
- **assets/**: Static assets like images

## Domain Model

The application follows Domain-Driven Design principles with the following key domains:

1. **User Domain**
   - User accounts
   - Authentication
   - Profiles
   - Roles and permissions

2. **Course Domain**
   - Course metadata
   - Sections and lectures
   - Enrollments
   - Progress tracking

3. **Video Domain**
   - Video storage
   - Streaming
   - Processing
   - Analytics

## Communication Patterns

- **Synchronous Communication**: REST APIs for direct service-to-service communication
- **Service Discovery**: Eureka for service registration and discovery
- **API Gateway**: Spring Cloud Gateway for routing and load balancing

## Database Structure

Each microservice has its own database schema:

- **Auth Service**: Users, roles, permissions
- **User Service**: User profiles, preferences
- **Course Service**: Courses, sections, lectures, enrollments
- **Video Service**: Video metadata, processing status

## Deployment

The application is containerized using Docker and can be deployed using:

1. Docker Compose for local development
2. Kubernetes for production (configuration in progress)

## Monitoring and Observability

- **Metrics**: Prometheus and Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Tracing**: Micrometer and Zipkin 