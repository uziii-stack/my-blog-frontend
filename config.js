const API_CONFIG = {
  BASE_URL:
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://my-blog-backend-production.up.railway.app",

  ENDPOINTS: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    POSTS: "/api/posts",
    POST_BY_ID: (id) => `/api/posts/${id}`,
    CREATE_POST: "/api/posts",
    UPLOAD_IMAGE: "/api/posts/upload"
  }
};

function getApiUrl(endpoint) {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

window.API_CONFIG = API_CONFIG;
window.getApiUrl = getApiUrl;
