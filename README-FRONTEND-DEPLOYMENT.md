# Progress Accountants Frontend - Standalone Deployment

## Overview
Complete standalone React frontend for Progress Accountants, ready for Hetzner VPS deployment with NGINX static hosting.

## Features Included
- Authentic Progress Accountants branding and content
- Complete team member profiles with photos
- Professional services and industry pages
- Responsive design with skeleton loading
- Zero backend dependencies

## Quick Start

### 1. Extract Files
```bash
# Copy these files from the Replit project:
client/src/           → src/
client/public/        → public/
attached_assets/      → assets/
tailwind.config.ts    → tailwind.config.ts
postcss.config.js     → postcss.config.js
```

### 2. Use Prepared Configs
```bash
# Rename these files:
frontend-package.json → package.json
frontend-vite.config.ts → vite.config.ts
frontend-env.example → .env
```

### 3. Build and Deploy
```bash
npm install
npm run build
# Copy dist/ contents to /var/www/html/ on Hetzner VPS
```

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

## Production Ready
- Static files only
- Optimized build output
- CDN compatible
- No server required