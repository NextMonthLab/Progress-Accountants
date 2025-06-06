# Progress Accountants Frontend - Hetzner Deployment

## Exact Files to Extract and Deploy

### 1. Copy Configuration Files (rename as shown):
```
frontend-package.json → package.json
frontend-vite.config.ts → vite.config.ts
frontend-tsconfig.json → tsconfig.json
frontend-env.example → .env
tailwind.config.ts → tailwind.config.ts
postcss.config.js → postcss.config.js
```

### 2. Copy Source Directories:
```
client/src/ → src/
client/public/ → public/
attached_assets/ → assets/
```

### 3. Deploy Commands:
```bash
npm install
npm run build
# Copy dist/ contents to /var/www/html/ on Hetzner
```

### 4. NGINX Config:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Result:** Standalone Progress Accountants website with authentic team photos, branding, and content - no backend required.