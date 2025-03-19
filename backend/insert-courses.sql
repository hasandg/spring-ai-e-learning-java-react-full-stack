\c course_service_db;

-- Create courses table if it doesn't exist
CREATE TABLE IF NOT EXISTS courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    level VARCHAR(50),
    price DECIMAL(10, 2),
    image_url TEXT,
    instructor_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample courses
INSERT INTO courses (title, description, category, level, price, image_url, instructor_id) VALUES 
('Introduction to Programming', 'Learn the basics of programming with this introductory course', 'Programming', 'Beginner', 49.99, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80', 1),
('Web Development Fundamentals', 'Master HTML, CSS, and JavaScript to build modern websites', 'Web Development', 'Beginner', 59.99, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80', 1),
('Mobile App Development', 'Create native and cross-platform mobile applications', 'Mobile', 'Intermediate', 79.99, 'https://images.unsplash.com/photo-1526925539332-aa3b66e35444?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80', 2),
('Data Science Essentials', 'Learn data analysis, visualization, and machine learning', 'Data Science', 'Intermediate', 89.99, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80', 2),
('Cloud Computing', 'Understand cloud infrastructure and deployment strategies', 'Cloud', 'Advanced', 99.99, 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80', 3),
('Cybersecurity Basics', 'Learn how to protect systems and data from cyber threats', 'Security', 'Beginner', 69.99, 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80', 3);

-- Create enrollments table for tracking user progress
CREATE TABLE IF NOT EXISTS enrollments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    progress INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ENROLLED',
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, course_id)
);

-- Create ratings table for course ratings
CREATE TABLE IF NOT EXISTS ratings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, course_id)
);

-- Add sample ratings
INSERT INTO ratings (user_id, course_id, rating, comment) VALUES 
(1, 1, 5, 'Excellent introduction to programming concepts!'),
(2, 1, 4, 'Great for beginners, very clear explanations'),
(1, 2, 5, 'Comprehensive overview of web development'),
(2, 3, 4, 'Very practical examples for mobile development'),
(3, 4, 5, 'The best data science course I have taken'),
(1, 5, 4, 'Solid introduction to cloud concepts'),
(3, 6, 5, 'Essential knowledge for anyone in tech');

-- Add some sample enrollments
INSERT INTO enrollments (user_id, course_id, progress, status) VALUES 
(1, 1, 75, 'IN_PROGRESS'),
(1, 2, 30, 'IN_PROGRESS'),
(2, 1, 100, 'COMPLETED'),
(2, 3, 50, 'IN_PROGRESS'),
(3, 4, 25, 'IN_PROGRESS'),
(3, 5, 10, 'IN_PROGRESS'); 