# Progress Accountants - Static Website Deployment

A premium-quality, clean static React website for Progress Accountants, designed for deployment to Hetzner VPS via NGINX hosting.

## Overview

This is a complete, standalone static website package containing only public-facing pages with no admin dependencies, backend connections, or complex integrations. Built to "world leading app" premium quality standards for professional deployment.

## Features

### Core Pages
- **Home Page** - Professional landing page with services overview
- **About Page** - Company information and values
- **Services Page** - Comprehensive service listings and process
- **Team Page** - Professional team member profiles
- **Contact Page** - Contact form and business information
- **Testimonials Page** - Client testimonials and success metrics
- **Privacy Policy** - Legal compliance documentation
- **Terms of Service** - Service agreement terms

### Technical Features
- React 18 with TypeScript
- Vite build system for optimized static assets
- Tailwind CSS for responsive design
- Wouter for client-side routing
- Lazy loading for optimal performance
- Mobile-first responsive design
- SEO-optimized meta tags
- Professional typography and spacing

## Build Requirements

- Node.js 18+ 
- npm or yarn package manager

## Installation & Build

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Deployment Structure

After running `npm run build`, the `dist/` directory contains:

```
dist/
├── index.html              # Main HTML file
├── assets/
│   ├── index-[hash].js     # Optimized JavaScript bundle
│   ├── index-[hash].css    # Compiled CSS styles
│   └── [other assets]      # Additional static assets
└── vite.svg               # Default favicon
```

## NGINX Configuration

```nginx
server {
    listen 80;
    server_name progressaccountants.co.uk www.progressaccountants.co.uk;
    root /var/www/progress-accountants;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

## Deployment Steps

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload to VPS**
   ```bash
   scp -r dist/* user@your-hetzner-vps:/var/www/progress-accountants/
   ```

3. **Configure NGINX**
   - Add the above configuration to your NGINX sites
   - Test configuration: `nginx -t`
   - Reload NGINX: `systemctl reload nginx`

4. **SSL Setup** (recommended)
   ```bash
   certbot --nginx -d progressaccountants.co.uk -d www.progressaccountants.co.uk
   ```

## Design Standards

This website meets premium quality standards with:

- **Professional Typography** - Inter font family with proper hierarchy
- **Consistent Spacing** - Tailwind spacing system throughout
- **Color Scheme** - Professional blue primary with gray accents
- **Responsive Design** - Mobile-first approach with tablet and desktop breakpoints
- **Accessibility** - Proper contrast ratios and semantic HTML
- **Performance** - Optimized assets and lazy loading

## Content Structure

### Business Information
- **Company**: Progress Accountants
- **Established**: 2018
- **Location**: Studio Banbury, Merton Street, Banbury, OX16 4RN
- **Phone**: 01295 250085
- **Email**: hello@progressaccountants.co.uk

### Service Areas
- Oxfordshire
- Warwickshire  
- Buckinghamshire

### Core Services
- Bookkeeping & Management Accounts
- VAT Returns & Tax Planning
- Payroll Services
- Financial Advisory
- Company Formation
- Self Assessment
- Corporation Tax Returns

### Industry Specializations
- Film Industry Tax Relief
- Music Industry Accounting
- Construction Industry Schemes
- Professional Services Support

## File Structure

```
progress-static-deploy/
├── public/
│   └── vite.svg
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ServicesPage.tsx
│   │   ├── TeamPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── TestimonialsPage.tsx
│   │   ├── PrivacyPolicyPage.tsx
│   │   └── TermsOfServicePage.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Performance Optimizations

- **Code Splitting** - Lazy loading for non-critical pages
- **Asset Optimization** - Vite handles bundling and minification
- **CSS Purging** - Tailwind removes unused styles
- **Image Optimization** - SVG icons for scalability
- **Caching Strategy** - Proper cache headers for static assets

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Maintenance

This static website requires no backend maintenance. Updates can be made by:

1. Modifying source files
2. Running `npm run build`
3. Uploading new `dist/` contents to the server

## License

Proprietary - Progress Accountants Limited