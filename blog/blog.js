/**
 * Blog Frontend JavaScript
 * Handles dynamic content loading and rendering
 */

// ===== UTILITY FUNCTIONS =====

/**
 * Format date to readable string
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Truncate text to specified length
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

/**
 * Get excerpt from content
 */
function getExcerpt(content, maxLength = 150) {
    // Remove extra whitespace and newlines
    const cleanContent = content.replace(/\s+/g, ' ').trim();
    return truncateText(cleanContent, maxLength);
}

/**
 * Get query parameter from URL
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Format content with proper paragraph breaks and rich text elements
 */
function formatContent(content) {
    // Split content by double newlines to create paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim());

    return paragraphs
        .map(paragraph => {
            // Check for Headings
            if (paragraph.startsWith('#')) {
                const match = paragraph.match(/^(#+)\s*(.*)/);
                if (match) {
                    const level = match[1].length;
                    const text = match[2];
                    return `<h${Math.min(level + 1, 6)}>${text}</h${Math.min(level + 1, 6)}>`;
                }
            }

            // Check for Blockquotes
            if (paragraph.startsWith('>')) {
                const text = paragraph.replace(/^>\s*/, '');
                return `<blockquote>${text}</blockquote>`;
            }

            // Check for Code Blocks
            if (paragraph.startsWith('```')) {
                const text = paragraph.replace(/```/g, '').trim();
                return `<pre><code>${text}</code></pre>`;
            }

            // Regular paragraph
            return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
        })
        .join('');
}

// ===== BLOG LISTING PAGE =====
// Specific check for posts.html to avoid overlapping with post.html
if (window.location.pathname.includes('posts.html') || window.location.pathname.endsWith('/blog/')) {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const postsGrid = document.getElementById('postsGrid');
    const emptyState = document.getElementById('emptyState');

    /**
     * Load and display all posts
     */
    async function loadPosts() {
        try {
            loadingState.style.display = 'block';
            errorState.style.display = 'none';
            postsGrid.style.display = 'none';
            emptyState.style.display = 'none';

            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.POSTS));

            if (!response.ok) {
                throw new Error('Failed to load posts');
            }

            const data = await response.json();

            loadingState.style.display = 'none';

            // Handle both response formats: data.posts or data.data
            const posts = data.posts || data.data || [];

            if (!posts || posts.length === 0) {
                emptyState.style.display = 'block';
                return;
            }

            postsGrid.style.display = 'grid';
            renderPosts(posts);
        } catch (error) {
            console.error('Error loading posts:', error);
            loadingState.style.display = 'none';
            errorState.style.display = 'block';
            errorState.querySelector('.error-message').textContent =
                'Failed to load posts. Please try again.';
        }
    }

    /**
     * Render posts in grid
     */
    function renderPosts(posts) {
        postsGrid.innerHTML = '';

        posts.forEach(post => {
            const postCard = createPostCard(post);
            postsGrid.appendChild(postCard);
        });
    }

    /**
     * Create post card element
     */
    function createPostCard(post) {
        const card = document.createElement('article');
        card.className = 'post-card';
        card.onclick = () => {
            window.location.href = `post.html?id=${post._id}`;
        };

        const imageUrl = post.image
            ? (post.image.startsWith('http') ? post.image : `${API_CONFIG.BASE_URL}${post.image}`)
            : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop';

        card.innerHTML = `
            <img src="${imageUrl}" alt="${post.title}" class="post-card-image">
            <div class="post-card-content">
                <span class="post-card-category">${post.category}</span>
                <h2 class="post-card-title">${post.title}</h2>
                <p class="post-card-excerpt">${getExcerpt(post.content)}</p>
                <div class="post-card-footer">
                    <span class="post-card-date">${formatDate(post.createdAt || post.date)}</span>
                    <a href="post.html?id=${post._id}" class="post-card-link">Read More →</a>
                </div>
            </div>
        `;

        return card;
    }

    // Load posts on page load
    loadPosts();
}

// ===== SINGLE POST PAGE =====
// Ensure we don't trigger this for posts.html
if (window.location.pathname.includes('post.html') && !window.location.pathname.includes('posts.html')) {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const postContent = document.getElementById('postContent');

    // Get post ID from URL
    const postId = getQueryParam('id');

    if (!postId) {
        window.location.href = 'posts.html';
    }

    /**
     * Load and display single post
     */
    async function loadPost() {
        try {
            loadingState.style.display = 'flex';
            errorState.style.display = 'none';
            postContent.style.display = 'none';

            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.POST_BY_ID(postId)));

            if (!response.ok) {
                throw new Error('Failed to load post');
            }

            const data = await response.json();

            // Handle both response formats: data.post or data.data
            const post = data.post || data.data;

            loadingState.style.display = 'none';
            postContent.style.display = 'block';

            renderPost(post);
        } catch (error) {
            console.error('Error loading post:', error);
            loadingState.style.display = 'none';
            errorState.style.display = 'flex';
            errorState.querySelector('.error-message').textContent =
                'Failed to load post. Please try again.';
        }
    }

    /**
     * Render post content
     */
    function renderPost(post) {
        // Update page title
        document.title = `${post.title} - Blog CMS`;

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', getExcerpt(post.content, 160));
        }

        // Render Hero Details
        document.getElementById('postCategory').textContent = post.category;
        document.getElementById('postTitle').textContent = post.title;
        document.getElementById('postDate').innerHTML = `<i class="far fa-calendar-alt"></i> ${formatDate(post.createdAt || post.date)}`;

        // Update Hero Background
        const postHero = document.getElementById('postHero');
        if (post.image) {
            const imageUrl = post.image.startsWith('http') ? post.image : `${API_CONFIG.BASE_URL}${post.image}`;
            postHero.style.backgroundImage = `url('${imageUrl}')`;
        } else {
            // Default placeholder
            postHero.style.backgroundImage = `url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop')`;
        }

        // Update Breadcrumbs
        document.getElementById('breadcrumbActive').textContent = post.title;

        // Populate bottom category
        document.getElementById('postBottomCategory').textContent = post.category;

        // Render content body
        const contentBody = document.getElementById('postContentBody');
        contentBody.innerHTML = formatContent(post.content);
    }

    // Load post on page load
    loadPost();
}
