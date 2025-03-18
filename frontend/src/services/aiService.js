import axios from 'axios';

// Use environment variables with fallback
const API_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8085/api/ai';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('AI Service Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// AI service functions
export const aiService = {
  // Ask a question to the AI assistant
  askQuestion: async (question, courseId = null, context = null) => {
    try {
      // Get user ID from localStorage if available
      const user = localStorage.getItem('user') 
        ? JSON.parse(localStorage.getItem('user')) 
        : null;
      
      const userId = user?.id;
      
      const payload = {
        question,
        courseId,
        userId,
        context
      };
      
      const response = await apiClient.post('/ask', payload);
      return response.data;
    } catch (error) {
      console.error('Error asking AI question:', error);
      throw error;
    }
  },
  
  // Check if the AI service is available
  checkHealth: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('AI service health check failed:', error);
      return false;
    }
  }
};

export default aiService; 