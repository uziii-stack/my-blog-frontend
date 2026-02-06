#  Blogs - Premium Frontend Engine

High-performance, vanilla JavaScript blogging interface featuring a modern design system, glassmorphism, and recruiter-impressing UI/UX.

---

## 🔥 Design Highlights

### 💎 Crystal-Blur Design System
We've implemented a custom design system using CSS variables and modern layout techniques:
- **Glassmorphism:** Use of `backdrop-filter: blur()` and semi-transparent backgrounds for a premium feel.
- **Micro-Animations:** Smooth hover transitions (`0.3s cubic-bezier`) on all interactive cards and buttons.
- **Dynamic Grid:** Responsive flex and grid systems that adapt flawlessly from mobile to 4K.
- **Custom Scroll:** Refined scroll behaviors and sticky navigation.

### 🏠 Modern Homepage
- **Auto-Sliding Hero:** A technical focus area presenting key value propositions.
- **Service/Feature Cards:** Using high-contrast iconography and deep shadows for depth.
- **Integrated CTA:** Bold, gradient-driven calls to action.

### 📰 Public Blog Listing (`posts.html`)
- **Real-Time Search:** Instant client-side filtering by article title or category.
- **Hover-Active Cards:** Cards that elevate and expand on hover to guide user focus.
- **Shared Branding:** Consistent "Cortellect Blogs" header and footer.

### 📖 Immersive Post View (`post.html`)
- **Cinematic Hero:** Post-specific featured image used as a full-width background hero.
- **Breadcrumb Navigation:** `Home > Blog > Title` structure for logical site hierarchy.
- **Typography Focus:** Optimal line-height and letter-spacing for long-form reading.
- **Rich Media Support:** Custom styles for code blocks, blockquotes, and tables.

---

## 📁 Directory Structure

```
frontend/
├── admin/               # Administrative CMS Dashboard
│   ├── login.html      # Secure JWT Login
│   ├── dashboard.html  # CRUD Operations Table
│   └── ...js/css       # Admin logic & minimalist styling
├── blog/                # Public Facing Blog
│   ├── posts.html      # Modern Grid & Search (Renamed from index.html)
│   ├── post.html       # Immersive Article View
│   └── ...js/css       # Premium Blog Styles & Animations
├── assets/              # Local brand assets
├── home.css             # Main site's design system & home styles
├── home.js              # Carousel & Mobile Menu logic
└── config.js            # Global API environment configuration
```

---

## 🚀 Setup & Integration

### API Configuration
To point the frontend to your backend, edit `config.js`:
```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000',
    ENDPOINTS: { ... }
};
```

### Local Development
Run any light HTTP server from the `frontend/` root:
```bash
# Example using Python
python -m http.server 8080
```
Access points:
- **Main Home:** `http://localhost:8080/index.html`
- **Blog Listing:** `http://localhost:8080/blog/posts.html`

---

## 🛠️ Built With
- **Vanilla HTML5/CSS3:** No frameworks, pure performance.
- **ES6+ JavaScript:** Modern async/await and DOM manipulation.
- **Font Awesome 6:** Premium SVG iconography.
- **Google Fonts (Outfit):** Modern typography for a tech-focused look.

---

## 👨‍💻 Developer
**Muhammad Uzair Baig**  
Managed with love and clean code.

---

**Last Updated:** 2026-01-28
