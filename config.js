/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 * Change API_BASE_URL to match your backend server URL
 */

const API_CONFIG = {
    // Backend API base URL
    BASE_URL: 'http://localhost:5000',

    // API endpoints
    ENDPOINTS: {
        // Authentication
        LOGIN: '/api/auth/login',

        // Posts
        POSTS: '/api/posts',
        POST_BY_ID: (id) => `/api/posts/${id}`,
    }
};

// Helper function to get full API URL
const getApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};
