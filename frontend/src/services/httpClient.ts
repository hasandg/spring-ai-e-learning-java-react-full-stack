import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { authService } from './authService';

// Base API URLs from environment variables
const COURSE_SERVICE_URL = process.env.NEXT_PUBLIC_COURSE_SERVICE_URL || 'http://localhost:8084';
const VIDEO_SERVICE_URL = process.env.NEXT_PUBLIC_VIDEO_SERVICE_URL || 'http://localhost:8085';

// Create Axios instance
const axiosInstance: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      try {
        // Try to refresh token if it's about to expire (5 seconds threshold)
        const token = await authService.updateToken(5);
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to refresh token:', error);
        // Will be redirected to login page by Keycloak
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // For Spring Boot ApiResponse wrapper format
    if (response.data && response.data.success !== undefined) {
      if (response.data.success) {
        return response.data.data;
      } else {
        return Promise.reject(new Error(response.data.message || 'An error occurred'));
      }
    }
    return response.data;
  },
  (error: AxiosError) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // The request was made and the server responded with an error status
      const status = error.response.status;
      
      if (status === 401) {
        // Unauthorized - token expired or invalid
        console.log('Authentication error, redirecting to login');
        if (typeof window !== 'undefined') {
          authService.login();
        }
      } else if (status === 403) {
        // Forbidden - not enough permissions
        return Promise.reject(new Error('You do not have permission to access this resource'));
      } else if (status === 404) {
        // Not found
        return Promise.reject(new Error('Resource not found'));
      } else if (status >= 500) {
        // Server error
        return Promise.reject(new Error('Server error occurred. Please try again later'));
      }
      
      // Extract error message from response
      const responseData = error.response.data as any;
      const errorMessage = responseData?.message 
        || responseData?.error 
        || 'An error occurred';
        
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('No response from server. Please check your internet connection'));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(error);
    }
  }
);

// Service client functions
export const httpClient = {
  // Course service endpoints
  courseService: {
    getCourses: () => axiosInstance.get(`${COURSE_SERVICE_URL}/api/courses`),
    getCourse: (id: string) => axiosInstance.get(`${COURSE_SERVICE_URL}/api/courses/${id}`),
    createCourse: (data: any) => axiosInstance.post(`${COURSE_SERVICE_URL}/api/courses`, data),
    updateCourse: (id: string, data: any) => axiosInstance.put(`${COURSE_SERVICE_URL}/api/courses/${id}`, data),
    deleteCourse: (id: string) => axiosInstance.delete(`${COURSE_SERVICE_URL}/api/courses/${id}`),
  },
  
  // Video service endpoints
  videoService: {
    getVideos: (courseId: string) => axiosInstance.get(`${VIDEO_SERVICE_URL}/api/videos?courseId=${courseId}`),
    getVideo: (id: string) => axiosInstance.get(`${VIDEO_SERVICE_URL}/api/videos/${id}`),
    createVideo: (data: any) => axiosInstance.post(`${VIDEO_SERVICE_URL}/api/videos`, data),
    updateVideo: (id: string, data: any) => axiosInstance.put(`${VIDEO_SERVICE_URL}/api/videos/${id}`, data),
    deleteVideo: (id: string) => axiosInstance.delete(`${VIDEO_SERVICE_URL}/api/videos/${id}`),
    streamVideo: (id: string) => `${VIDEO_SERVICE_URL}/api/videos/${id}/stream`,
  },
  
  // Generic request methods
  get: <T>(url: string, config?: InternalAxiosRequestConfig) => axiosInstance.get<T, T>(url, config),
  post: <T>(url: string, data?: any, config?: InternalAxiosRequestConfig) => axiosInstance.post<T, T>(url, data, config),
  put: <T>(url: string, data?: any, config?: InternalAxiosRequestConfig) => axiosInstance.put<T, T>(url, data, config),
  patch: <T>(url: string, data?: any, config?: InternalAxiosRequestConfig) => axiosInstance.patch<T, T>(url, data, config),
  delete: <T>(url: string, config?: InternalAxiosRequestConfig) => axiosInstance.delete<T, T>(url, config),
}; 