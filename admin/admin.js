/**
 * Admin Panel JavaScript
 * Handles authentication, CRUD operations, and UI interactions
 */

// ===== UTILITY FUNCTIONS =====

/**
 * Get JWT token from localStorage
 */
function getToken() {
    return localStorage.getItem('blog_cms_token');
}

/**
 * Set JWT token in localStorage
 */
function setToken(token) {
    localStorage.setItem('blog_cms_token', token);
}

/**
 * Remove JWT token from localStorage
 */
function removeToken() {
    localStorage.removeItem('blog_cms_token');
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return !!getToken();
}

/**
 * Protect routes - redirect to login if not authenticated
 */
function protectRoute() {
    const token = getToken();
    if (!token || token === 'undefined' || token === 'null') {
        console.warn('⚠️ Session missing or invalid. Redirecting to login.');
        removeToken();
        window.location.replace('login.html');
    }
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Show error message
 */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        errorElement.style.display = 'block';
    }
}

/**
 * Hide error message
 */
function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.remove('show');
        errorElement.style.display = 'none';
    }
}

/**
 * Show success message
 */
function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.textContent = message;
        successElement.classList.add('show');
        successElement.style.display = 'block';
    }
}

/**
 * API request helper with authentication
 */
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        ...options.headers,
    };

    // Add authorization header if token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Don't add Content-Type for FormData
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(getApiUrl(endpoint), {
            ...options,
            headers,
        });

        // 🛡️ SECURITY FIX: Handle 401 Unauthorized (Expired or Invalid Token)
        if (response.status === 401) {
            console.error('🚫 Session expired or unauthorized. Logging out...');
            removeToken();

            // Avoid infinite loops if already on login page
            if (!window.location.pathname.includes('login.html')) {
                window.location.replace('login.html');
            }
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('📡 API Request Error:', error.message);
        throw error;
    }
}

// ===== LOGIN PAGE =====
if (window.location.pathname.includes('login.html')) {
    // Redirect to dashboard if already logged in
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }

    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError('errorMessage');

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Validation
        if (!email || !password) {
            showError('errorMessage', 'Please fill in all fields');
            return;
        }

        // Show loading state
        loginBtn.disabled = true;
        loginBtn.querySelector('.btn-text').style.display = 'none';
        loginBtn.querySelector('.btn-loader').style.display = 'inline';

        try {
            const data = await apiRequest(API_CONFIG.ENDPOINTS.LOGIN, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            // Store token (handle both data.token and token formats)
            const token = data.token || data.data?.token;
            if (token) {
                setToken(token);
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                throw new Error('No token received from server');
            }
        } catch (error) {
            showError('errorMessage', error.message);
            loginBtn.disabled = false;
            loginBtn.querySelector('.btn-text').style.display = 'inline';
            loginBtn.querySelector('.btn-loader').style.display = 'none';
        }
    });
}

// ===== DASHBOARD PAGE =====
if (window.location.pathname.includes('dashboard.html')) {
    protectRoute();

    const logoutBtn = document.getElementById('logoutBtn');
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const postsTableContainer = document.getElementById('postsTableContainer');
    const emptyState = document.getElementById('emptyState');
    const postsTableBody = document.getElementById('postsTableBody');
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    let postToDelete = null;

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        removeToken();
        window.location.href = 'login.html';
    });

    // Fetch and display posts
    async function loadPosts() {
        try {
            loadingState.style.display = 'block';
            errorState.style.display = 'none';
            postsTableContainer.style.display = 'none';
            emptyState.style.display = 'none';

            const data = await apiRequest(API_CONFIG.ENDPOINTS.POSTS);
            const posts = data.posts || data;

            loadingState.style.display = 'none';

            if (!posts || posts.length === 0) {
                emptyState.style.display = 'block';
                return;
            }

            postsTableContainer.style.display = 'block';
            renderPosts(posts);
        } catch (error) {
            loadingState.style.display = 'none';
            errorState.style.display = 'block';
            errorState.querySelector('.error-message').textContent = error.message;
        }
    }

    // Render posts in table
    function renderPosts(posts) {
        postsTableBody.innerHTML = '';

        posts.forEach(post => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    ${post.image ? `<img src="${post.image.startsWith('http') ? post.image : API_CONFIG.BASE_URL + post.image}" alt="${post.title}" class="post-image">` : '<div class="post-image" style="background: #e2e8f0;"></div>'}
                </td>
                <td class="post-title">${post.title}</td>
                <td><span class="post-category">${post.category}</span></td>
                <td class="post-date">${formatDate(post.createdAt || post.date)}</td>
                <td class="table-actions">
                    <a href="edit-post.html?id=${post._id}" class="btn btn-secondary btn-sm">Edit</a>
                    <button class="btn btn-danger btn-sm" onclick="openDeleteModal('${post._id}')">Delete</button>
                </td>
            `;
            postsTableBody.appendChild(row);
        });
    }

    // Delete modal functions
    window.openDeleteModal = (postId) => {
        postToDelete = postId;
        deleteModal.style.display = 'flex';
    };

    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none';
        postToDelete = null;
    });

    confirmDeleteBtn.addEventListener('click', async () => {
        if (!postToDelete) return;

        try {
            await apiRequest(API_CONFIG.ENDPOINTS.POST_BY_ID(postToDelete), {
                method: 'DELETE',
            });

            deleteModal.style.display = 'none';
            postToDelete = null;
            loadPosts();
        } catch (error) {
            alert('Error deleting post: ' + error.message);
        }
    });

    // Load posts on page load
    loadPosts();
}

// ===== ADD POST PAGE =====
if (window.location.pathname.includes('add-post.html')) {
    protectRoute();

    const logoutBtn = document.getElementById('logoutBtn');
    const addPostForm = document.getElementById('addPostForm');
    const submitBtn = document.getElementById('submitBtn');
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('imagePreview');

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        removeToken();
        window.location.href = 'login.html';
    });

    // Image preview
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = '';
        }
    });

    // Form submission
    addPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError('errorMessage');
        document.getElementById('successMessage').style.display = 'none';

        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('category').value.trim();
        const content = document.getElementById('content').value.trim();
        const image = imageInput.files[0];

        // Validation
        if (!title || !category || !content) {
            showError('errorMessage', 'Please fill in all required fields');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').style.display = 'none';
        submitBtn.querySelector('.btn-loader').style.display = 'inline';

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('category', category);
            formData.append('content', content);
            if (image) {
                formData.append('image', image);
            }

            await apiRequest(API_CONFIG.ENDPOINTS.POSTS, {
                method: 'POST',
                body: formData,
            });

            showSuccess('successMessage', 'Post created successfully!');

            // Reset form
            addPostForm.reset();
            imagePreview.innerHTML = '';

            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } catch (error) {
            showError('errorMessage', error.message);
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').style.display = 'inline';
            submitBtn.querySelector('.btn-loader').style.display = 'none';
        }
    });
}

// ===== EDIT POST PAGE =====
if (window.location.pathname.includes('edit-post.html')) {
    protectRoute();

    const logoutBtn = document.getElementById('logoutBtn');
    const editPostForm = document.getElementById('editPostForm');
    const submitBtn = document.getElementById('submitBtn');
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('imagePreview');
    const currentImage = document.getElementById('currentImage');

    // Get post ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        window.location.href = 'dashboard.html';
    }

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        removeToken();
        window.location.href = 'login.html';
    });

    // Load post data
    async function loadPost() {
        try {
            loadingState.style.display = 'block';
            errorState.style.display = 'none';
            editPostForm.style.display = 'none';

            const data = await apiRequest(API_CONFIG.ENDPOINTS.POST_BY_ID(postId));
            const post = data.post || data;

            // Populate form
            document.getElementById('title').value = post.title;
            document.getElementById('category').value = post.category;
            document.getElementById('content').value = post.content;

            if (post.image) {
                const imgSrc = post.image.startsWith('http') ? post.image : API_CONFIG.BASE_URL + post.image;
                currentImage.innerHTML = `
                    <img src="${imgSrc}" alt="${post.title}">
                    <p>Current featured image</p>
                `;
            }

            loadingState.style.display = 'none';
            editPostForm.style.display = 'block';
        } catch (error) {
            loadingState.style.display = 'none';
            errorState.style.display = 'block';
            errorState.querySelector('.error-message').textContent = error.message;
        }
    }

    // Image preview
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview"><p>New image preview</p>`;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = '';
        }
    });

    // Form submission
    editPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError('formErrorMessage');
        document.getElementById('successMessage').style.display = 'none';

        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('category').value.trim();
        const content = document.getElementById('content').value.trim();
        const image = imageInput.files[0];

        // Validation
        if (!title || !category || !content) {
            showError('formErrorMessage', 'Please fill in all required fields');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').style.display = 'none';
        submitBtn.querySelector('.btn-loader').style.display = 'inline';

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('category', category);
            formData.append('content', content);
            if (image) {
                formData.append('image', image);
            }

            await apiRequest(API_CONFIG.ENDPOINTS.POST_BY_ID(postId), {
                method: 'PUT',
                body: formData,
            });

            showSuccess('successMessage', 'Post updated successfully!');

            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } catch (error) {
            showError('formErrorMessage', error.message);
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').style.display = 'inline';
            submitBtn.querySelector('.btn-loader').style.display = 'none';
        }
    });

    // Load post on page load
    loadPost();
}
