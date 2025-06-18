# Hetzner Static Deployment Guide

## Production-Ready Container

The Progress Accountants frontend is now packaged for Hetzner deployment with:

### Container Configuration
- **Base**: nginx:alpine (lightweight production server)
- **Build**: 186MB optimized static files
- **Port**: 80 (standard HTTP)
- **Restart Policy**: unless-stopped

### Deployment Files Created
- `Dockerfile` - Nginx-based static file server
- `docker-compose.yml` - Container orchestration
- `.dockerignore` - Optimized build context

### Build Verification
✅ Production build successful  
✅ Static files ready in /dist/  
✅ Studio address: 1st Floor Beaumont House, Beaumont Road, OX16 1RH  
✅ Chatbot embed: progress-accountants-uk-chatbot-1750188617452  
✅ Calendly integration operational  

### Hetzner Deployment Commands
```bash
# Build the container
docker build -t progress-accountants-frontend .

# Run locally (test)
docker-compose up -d

# Deploy to Hetzner
docker save progress-accountants-frontend | gzip > progress-frontend.tar.gz
# Upload to Hetzner and deploy via their container service
```

### Container Access
- **URL**: http://your-hetzner-domain.com
- **Health Check**: Static files served from nginx
- **Logs**: `docker logs progress-accountants-frontend`

The container is ready for immediate Hetzner deployment.