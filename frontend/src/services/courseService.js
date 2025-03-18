import axios from 'axios';

// Direct connection to course service for development
// In production, this would use API Gateway with service discovery
const API_URL = process.env.NEXT_PUBLIC_COURSE_API_URL || 'http://localhost:8084/api';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding the auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

class CourseService {
  async getAllCourses() {
    try {
      const response = await apiClient.get('/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      return this.getFallbackCourses();
    }
  }

  async getCourseById(id) {
    try {
      const response = await apiClient.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }
  }

  async getCoursesByCategory(category) {
    try {
      const response = await apiClient.get(`/courses/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching courses by category ${category}:`, error);
      return this.getFallbackCourses();
    }
  }

  async searchCourses(keyword) {
    try {
      const response = await apiClient.get(`/courses/search?keyword=${keyword}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching courses with keyword ${keyword}:`, error);
      return this.getFallbackCourses();
    }
  }
  
  // Fallback method for development/testing when the API is not available
  getFallbackCourses() {
    return [
      {
        id: 1,
        title: 'Introduction to Programming',
        description: 'Learn the basics of programming with this introductory course',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80',
        category: 'Programming',
        level: 'Beginner',
        instructorName: 'John Doe',
        progress: 0,
        averageRating: 4.5,
        enrollmentCount: 1250
      },
      {
        id: 2,
        title: 'Web Development Fundamentals',
        description: 'Master HTML, CSS, and JavaScript to build modern websites',
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80',
        category: 'Web Development',
        level: 'Beginner',
        instructorName: 'Jane Smith',
        progress: 0,
        averageRating: 4.7,
        enrollmentCount: 980
      },
      {
        id: 3,
        title: 'Mobile App Development',
        description: 'Create native and cross-platform mobile applications',
        imageUrl: 'https://images.unsplash.com/photo-1526925539332-aa3b66e35444?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80',
        category: 'Mobile',
        level: 'Intermediate',
        instructorName: 'Sarah Johnson',
        progress: 0,
        averageRating: 4.3,
        enrollmentCount: 750
      },
      {
        id: 4,
        title: 'Data Science Essentials',
        description: 'Learn data analysis, visualization, and machine learning',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80',
        category: 'Data Science',
        level: 'Intermediate',
        instructorName: 'Michael Brown',
        progress: 0,
        averageRating: 4.8,
        enrollmentCount: 1100
      },
      {
        id: 5,
        title: 'Cloud Computing',
        description: 'Understand cloud infrastructure and deployment strategies',
        imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80',
        category: 'Cloud',
        level: 'Advanced',
        instructorName: 'Emily Wilson',
        progress: 0,
        averageRating: 4.6,
        enrollmentCount: 650
      },
      {
        id: 6,
        title: 'Cybersecurity Basics',
        description: 'Learn how to protect systems and data from cyber threats',
        imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80',
        category: 'Security',
        level: 'Beginner',
        instructorName: 'Robert Chen',
        progress: 0,
        averageRating: 4.9,
        enrollmentCount: 920
      }
    ];
  }
}

export default new CourseService(); 