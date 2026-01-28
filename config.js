/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 * Supports local development and production (Railway backend)
 */

const API_CONFIG = {
  BASE_URL:
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://my-blog-backend.up.railway.app",

  ENDPOINTS: {
    // Auth
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",

    // Posts
    POSTS: "/api/posts",
    POST_BY_ID: (id) => `/api/posts/${id}`,
    CREATE_POST: "/api/posts",
    UPLOAD_IMAGE: "/api/posts/upload"
  }
};

// Helper to build full API URL
function getApiUrl(endpoint) {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Export for global usage (if using normal script tag)
window.API_CONFIG = API_CONFIG;
window.getApiUrl = getApiUrl;
