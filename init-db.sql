-- Create databases for each service
CREATE DATABASE auth_service_db;
CREATE DATABASE user_service_db;
CREATE DATABASE course_service_db;
CREATE DATABASE video_service_db;

-- Connect to auth_service_db and create schema
\c auth_service_db;

-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS auth;

-- Connect to user_service_db and create schema
\c user_service_db;

-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS users;

-- Connect to course_service_db and create schema
\c course_service_db;

-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS courses;

-- Connect to video_service_db and create schema
\c video_service_db;

-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS videos; 