# Blog CMS - Frontend

A complete frontend application for a blogging platform built with vanilla HTML, CSS, and JavaScript. This frontend connects to a Node.js + Express + MongoDB backend API.

## 📁 Project Structure

```
frontend/
├── admin/                      # Admin panel
│   ├── login.html             # Admin authentication page
│   ├── dashboard.html         # Posts management dashboard
│   ├── add-post.html          # Create new post
│   ├── edit-post.html         # Edit existing post
│   ├── admin.css              # Admin panel styles
│   └── admin.js               # Admin panel logic
├── blog/                       # Public blog frontend
│   ├── index.html             # Blog homepage
│   ├── post.html              # Single post view
│   ├── blog.css               # Blog styles
│   └── blog.js                # Blog logic
├── assets/                     # Static assets
│   └── images/                # Image files
├── config.js                   # API configuration
└── README.md                   # This file
```

## ✨ Features

### Admin Panel
- **Authentication**: Secure login with JWT tokens stored in localStorage
- **Dashboard**: View all blog posts in a clean table layout
- **Create Posts**: Add new blog posts with title, category, content, and image upload
- **Edit Posts**: Update existing posts with pre-populated forms
- **Delete Posts**: Remove posts with confirmation modal
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Public Blog
- **Homepage**: Grid layout displaying all blog posts with images, titles, excerpts, and dates
- **Single Post View**: Full post content with featured image and category
- **Responsive Design**: Mobile-first, fully responsive layout
- **SEO Friendly**: Semantic HTML structure with proper meta tags
- **Loading States**: User-friendly loading and error states

## 🔧 Backend API Connection

### Configure API URL

1. Open `config.js`
2. Update the `BASE_URL` to match your backend server:

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000',  // Change this to your backend URL
    // ...
};
```

### Required Backend Endpoints

The frontend expects the following API endpoints:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Admin login | No |
| GET | `/api/posts` | Get all posts | No |
| GET | `/api/posts/:id` | Get single post | No |
| POST | `/api/posts` | Create new post | Yes |
| PUT | `/api/posts/:id` | Update post | Yes |
| DELETE | `/api/posts/:id` | Delete post | Yes |

### Authentication

- Admin login returns a JWT token
- Token is stored in `localStorage` as `blog_cms_token`
- All authenticated requests include `Authorization: Bearer <token>` header

### Expected API Response Format

**Login Response:**
```json
{
  "token": "jwt_token_here"
}
```

**Posts List Response:**
```json
{
  "posts": [
    {
      "_id": "post_id",
      "title": "Post Title",
      "content": "Post content...",
      "category": "Technology",
      "image": "/uploads/image.jpg",
      "createdAt": "2026-01-28T12:00:00Z"
    }
  ]
}
```

**Single Post Response:**
```json
{
  "post": {
    "_id": "post_id",
    "title": "Post Title",
    "content": "Post content...",
    "category": "Technology",
    "image": "/uploads/image.jpg",
    "createdAt": "2026-01-28T12:00:00Z"
  }
}
```

### Image Uploads

- The admin panel sends images as `multipart/form-data`
- Image field name: `image`
- Backend should save images and return the file path in the response
- Images are displayed using `${API_BASE_URL}${post.image}`

## 🚀 How to Run

### Option 1: Simple File Server

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Start a simple HTTP server:

**Using Python:**
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

**Using Node.js:**
```bash
npx http-server -p 8080
```

**Using PHP:**
```bash
php -S localhost:8080
```

3. Open your browser:
   - Blog: `http://localhost:8080/blog/posts.html`
   - Admin: `http://localhost:8080/admin/login.html`

### Option 2: Live Server (VS Code)

1. Install the "Live Server" extension in VS Code
2. Right-click `index.html` in the blog or admin folder
3. Select "Open with Live Server"

### Option 3: Direct File Access

You can also open the HTML files directly in your browser:
- Navigate to the `blog` or `admin` folder
- Double-click on the HTML files

**Note:** Some features (like `fetch` API) may require a proper HTTP server due to CORS restrictions.

## 👨‍💼 Admin Panel Usage Guide

### 1. Login

1. Navigate to `admin/login.html`
2. Enter your admin credentials:
   - Email: Your admin email
   - Password: Your admin password
3. Click "Sign In"
4. You'll be redirected to the dashboard on successful authentication

### 2. Dashboard

- View all blog posts in a table
- See post images, titles, categories, and creation dates
- Click "Edit" to modify a post
- Click "Delete" to remove a post (requires confirmation)
- Click "+ Add New Post" to create a new post

### 3. Create a New Post

1. Click "+ Add New Post" on the dashboard
2. Fill in the form:
   - **Title**: Post headline (required, max 200 characters)
   - **Category**: Post category (required, e.g., Technology, Lifestyle)
   - **Featured Image**: Upload an image (optional)
   - **Content**: Post content (required, use line breaks for paragraphs)
3. Click "Publish Post"
4. You'll be redirected to the dashboard after successful creation

### 4. Edit a Post

1. Click "Edit" on any post in the dashboard
2. The form will be pre-populated with existing data
3. Modify any fields
4. Upload a new image to replace the current one (optional)
5. Click "Update Post"

### 5. Delete a Post

1. Click "Delete" on any post in the dashboard
2. Confirm the deletion in the modal
3. The post will be permanently removed

### 6. Logout

- Click the "Logout" button in the navigation bar
- You'll be redirected to the login page
- Your session token will be cleared

## 🎨 Design & Styling

- **Modern UI**: Clean, minimalist design with smooth animations
- **Color Scheme**: Primary blue (#2563eb) with professional grays
- **Typography**: System fonts for optimal performance and readability
- **Responsive**: Mobile-first design with breakpoints at 768px and 480px
- **Components**: Reusable button styles, form inputs, and cards
- **Hover Effects**: Subtle transform and shadow effects for better UX

## 🔒 Security Notes

- JWT tokens are stored in `localStorage` (consider `httpOnly` cookies for production)
- Always use HTTPS in production
- Implement proper CORS configuration on the backend
- Validate and sanitize all inputs on the backend
- Add rate limiting for login attempts
- Implement file upload validation (file type, size)

## 📝 Code Organization

### HTML
- Semantic HTML5 structure
- Proper meta tags for SEO
- Accessible form labels and ARIA attributes
- Clean, readable markup

### CSS
- CSS custom properties (variables) for theme management
- Mobile-first responsive design
- BEM-inspired naming conventions
- Organized with clear sections and comments

### JavaScript
- Well-commented and beginner-friendly
- Modular functions for reusability
- Async/await for API calls
- Proper error handling
- Page-specific code blocks
- Utility functions for common tasks

## 🚧 Future Improvements

- [ ] Rich text editor (e.g., TinyMCE, Quill) for better content formatting
- [ ] Image cropping and optimization before upload
- [ ] Pagination for blog posts
- [ ] Search functionality
- [ ] Category filtering
- [ ] Post tags
- [ ] Comments system
- [ ] Social media sharing buttons
- [ ] Related posts section
- [ ] Author profiles
- [ ] Draft/publish status
- [ ] Post scheduling
- [ ] Analytics dashboard
- [ ] SEO meta fields per post
- [ ] Dark mode toggle

## 🐛 Troubleshooting

### Common Issues

**1. API calls failing with CORS errors**
- Ensure your backend has proper CORS configuration
- Add the frontend URL to the allowed origins

**2. Images not displaying**
- Check that the backend is serving static files correctly
- Verify the image path format matches `post.image`
- Ensure `API_CONFIG.BASE_URL` is correct

**3. Login not working**
- Check browser console for error messages
- Verify the backend `/api/auth/login` endpoint is working
- Ensure the backend returns a `token` field

**4. Token expired**
- Clear localStorage and login again
- Implement token refresh logic on the backend

**5. Posts not loading**
- Check backend `/api/posts` endpoint
- Verify the response format matches expectations
- Check browser console for errors

## 📄 License

This project is open source and available for educational and commercial use.

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**
