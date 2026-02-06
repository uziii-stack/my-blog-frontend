/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 * Supports local development and live production (Railway backend)
 */

const API_CONFIG = {
    // Detect environment
    BASE_URL: window.location.hostname === 'localhost'
        ? 'http://localhost:5000'                  // Local development backend
        : 'https://my-blog-backend-production-0097.up.railway.app', // Production backend URL

    // API endpoints
    ENDPOINTS: {
        // Authentication
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register', // optional if you have register
        ME: '/api/auth/me', // verify token and get current user

        // Posts
        POSTS: '/api/posts',
        POST_BY_ID: (id) => `/api/posts/${id}`,
        CREATE_POST: '/api/posts/create', // if route exists
        UPLOAD_IMAGE: '/api/posts/upload', // if using multer
    }
};

/**
 * Helper function to get full API URL
 * @param {string} endpoint - endpoint path (e.g., API_CONFIG.ENDPOINTS.POSTS)
 * @returns {string} full URL for API call
 */
const getApiUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`;

/**
 * Example usage:
 * 
 * // Fetch all posts
 * fetch(getApiUrl(API_CONFIG.ENDPOINTS.POSTS))
 *   .then(res => res.json())
 *   .then(data => console.log(data));
 * 
 * // Fetch post by ID
 * fetch(getApiUrl(API_CONFIG.ENDPOINTS.POST_BY_ID('123456')))
 *   .then(res => res.json())
 *   .then(post => console.log(post));
 */
