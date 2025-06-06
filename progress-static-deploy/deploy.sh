#!/bin/bash

# Progress Accountants Static Deployment Script
# This script builds and prepares the static site for Hetzner VPS deployment

echo "🚀 Starting Progress Accountants Static Deployment Build..."

# Clean any previous builds
echo "Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.vite/

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the static site
echo "Building static site..."
npm run build

# Verify build success
if [ -d "dist" ]; then
    echo "✅ Build successful! Static files generated in 'dist' directory."
    echo ""
    echo "📦 Deployment Package Contents:"
    echo "├── dist/"
    echo "│   ├── index.html"
    echo "│   ├── assets/"
    echo "│   │   ├── *.js (optimized bundles)"
    echo "│   │   └── *.css (compiled styles)"
    echo "│   └── vite.svg"
    echo ""
    echo "🌐 Ready for NGINX deployment on Hetzner VPS"
    echo ""
    echo "NGINX Configuration Example:"
    echo "server {"
    echo "    listen 80;"
    echo "    server_name progressaccountants.co.uk;"
    echo "    root /var/www/progress-accountants;"
    echo "    index index.html;"
    echo ""
    echo "    location / {"
    echo "        try_files \$uri \$uri/ /index.html;"
    echo "    }"
    echo ""
    echo "    # Cache static assets"
    echo "    location /assets/ {"
    echo "        expires 1y;"
    echo "        add_header Cache-Control \"public, immutable\";"
    echo "    }"
    echo "}"
    echo ""
    echo "📋 Deployment Steps:"
    echo "1. Upload 'dist' contents to /var/www/progress-accountants/ on your Hetzner VPS"
    echo "2. Configure NGINX with the above configuration"
    echo "3. Set up SSL certificate (Let's Encrypt recommended)"
    echo "4. Test the deployment"
else
    echo "❌ Build failed! Check the error messages above."
    exit 1
fi