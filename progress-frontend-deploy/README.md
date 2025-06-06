# Progress Accountants - Standalone Frontend

## Deployment Ready Package

This is a complete standalone React frontend for Progress Accountants, optimized for static hosting on Hetzner VPS with NGINX.

## Quick Deploy

```bash
npm install
npm run build
# Copy dist/ contents to /var/www/html/
```

## Features

- Complete Progress Accountants branding and content
- All team member photos (Lee Rogers, Henry Simons, Manny Abayomi, Jackie Bosch, Joy Holloway)
- Professional services and industry pages
- Responsive design with skeleton loading
- Zero backend dependencies

## NGINX Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Built with React, Vite, TypeScript, and Tailwind CSS.