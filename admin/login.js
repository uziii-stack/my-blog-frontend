/**
 * 🔒 BLOG CMS - PRODUCTION LOGIN ENGINE
 * 
 * This file handles secure authentication for the admin panel.
 * Optimized for: GitHub Pages (Frontend) + Railway (Backend)
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🛡️ Login Engine Initialized');

    // Safety Audit: Ensure config.js loaded correctly
    if (typeof API_CONFIG === 'undefined' || typeof getApiUrl === 'undefined') {
        console.error('❌ Critical Error: config.js not found or failed to load.');
        alert('Site configuration error. Please refresh the page or contact the administrator.');
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('errorMessage');

    if (!loginForm) return;

    // Check if already logged in
    if (localStorage.getItem('blog_cms_token')) {
        console.log('✅ Token found, redirecting to dashboard...');
        window.location.replace('dashboard.html');
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('🚀 Login attempt started...');

        // UI Reset
        if (errorMessage) {
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';
        }

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showNotify('Please enter both email and password.', 'error');
            return;
        }

        toggleLoading(true);

        try {
            const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.LOGIN);
            console.log('📡 Calling API:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            console.log('📥 Response status:', response.status);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed. Please check your credentials.');
            }

            // Extract token from data or data.data
            const token = data.token || (data.data && data.data.token);

            if (token) {
                console.log('🔑 Token received, storing in localStorage...');
                localStorage.setItem('blog_cms_token', token);

                console.log('🎯 Redirecting to dashboard.html...');
                // Use replace for a clean history state on GitHub Pages
                window.location.replace('dashboard.html');
            } else {
                throw new Error('Token missing from server response.');
            }

        } catch (error) {
            console.error('❌ Login Error:', error);
            showNotify(error.message || 'Unable to connect to the server.', 'error');
        } finally {
            toggleLoading(false);
        }
    });

    function toggleLoading(isLoading) {
        if (!loginBtn) return;
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoader = loginBtn.querySelector('.btn-loader');
        loginBtn.disabled = isLoading;
        if (btnText) btnText.style.display = isLoading ? 'none' : 'inline';
        if (btnLoader) btnLoader.style.display = isLoading ? 'inline' : 'none';
    }

    function showNotify(message, type) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            errorMessage.className = `error-message ${type}`;
        } else {
            alert(message);
        }
    }
});
