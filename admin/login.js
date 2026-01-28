/**
 * 🔒 BLOG CMS - PRODUCTION LOGIN ENGINE
 * 
 * This file handles secure authentication for the admin panel.
 * Optimized for: GitHub Pages (Frontend) + Railway (Backend)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Audit: Selectors must be specific to prevent conflicts with other admin pages
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('errorMessage');

    // Safety check: Exit if not on login page
    if (!loginForm) return;

    // FIX: Redirect already logged-in users immediately to prevent flash of login screen
    if (localStorage.getItem('blog_cms_token')) {
        window.location.href = 'dashboard.html';
    }

    /**
     * Handle Login Form Submission
     */
    loginForm.addEventListener('submit', async (e) => {
        // FIX 1: Crucial to prevent default form submission 
        // This stops the page reload and sensitive data appearing in URL query params (?email=...)
        e.preventDefault();

        // UI Reset
        if (errorMessage) {
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';
        }

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Validation
        if (!email || !password) {
            showNotify('Please enter both email and password.', 'error');
            return;
        }

        // FIX 2: Set loading state visually to prevent multiple clicks
        toggleLoading(true);

        try {
            // FIX 3: Construct absolute API URL using config helpers
            // Note: Railway requires 'Content-Type: application/json' for body parsing
            const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.LOGIN);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                // FIX 4: Handle specific backend error messages (e.g., "Invalid credentials")
                throw new Error(data.message || 'Authentication failed. Please check your credentials.');
            }

            // FIX 5: Handle flexible token response formats (data.token vs data.data.token)
            const token = data.token || (data.data && data.data.token);

            if (token) {
                // FIX 6: Securely store JWT in localStorage for subsequent authenticated requests
                localStorage.setItem('blog_cms_token', token);

                // FIX 7: Perform clean redirect
                // Note: Relative path 'dashboard.html' works best on GitHub Pages subfolders
                window.location.replace('dashboard.html');
            } else {
                throw new Error('Token missing from server response.');
            }

        } catch (error) {
            // FIX 8: Graceful Error Handling for Network issues vs Backend errors
            console.error('Login Error:', error);
            showNotify(error.message || 'Unable to connect to the server. Please check your internet connection.', 'error');
        } finally {
            toggleLoading(false);
        }
    });

    /**
     * UI Helper: Toggle Loading Button State
     */
    function toggleLoading(isLoading) {
        if (!loginBtn) return;

        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoader = loginBtn.querySelector('.btn-loader');

        loginBtn.disabled = isLoading;
        if (btnText) btnText.style.display = isLoading ? 'none' : 'inline';
        if (btnLoader) btnLoader.style.display = isLoading ? 'inline' : 'none';
    }

    /**
     * UI Helper: Show Error Messages
     */
    function showNotify(message, type) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            errorMessage.className = `error-message ${type}`;

            // Add slight animation
            errorMessage.style.animation = 'none';
            errorMessage.offsetHeight; /* trigger reflow */
            errorMessage.style.animation = 'shake 0.5s ease-in-out';
        } else {
            alert(message);
        }
    }
});
