# Render Deployment Guide - Progress Accountants

## Current Deployment Issue

The deployment is failing with the error:
```
Error: DATABASE_URL must be set. Did you forget to provision a database?
```

## Steps to Fix Deployment on Render

### 1. Set Up PostgreSQL Database on Render

1. **Create a PostgreSQL Service:**
   - Go to your Render Dashboard
   - Click "New +" → "PostgreSQL"
   - Name: `progress-accountants-db`
   - Region: Choose same region as your web service
   - PostgreSQL Version: 16 (recommended)
   - Plan: Choose appropriate plan (Free tier available)

2. **Get Database Connection Details:**
   - Once created, go to the PostgreSQL service page
   - Copy the "External Database URL" - this is your `DATABASE_URL`

### 2. Configure Environment Variables

1. **Go to Your Web Service:**
   - Navigate to your Progress Accountants web service on Render
   - Go to "Environment" tab

2. **Add Required Environment Variables:**
   ```
   DATABASE_URL=postgresql://username:password@hostname:port/database_name
   NODE_ENV=production
   ```

3. **Optional Environment Variables (if needed):**
   ```
   SENDGRID_API_KEY=your_sendgrid_key_here
   OPENAI_API_KEY=your_openai_key_here
   ANTHROPIC_API_KEY=your_anthropic_key_here
   ```

### 3. Database Schema Setup

After setting the `DATABASE_URL`, the application should start successfully. The database schema will be automatically handled by Drizzle ORM migrations.

### 4. Build Configuration

The current build command is correct:
```bash
npm install; npm run build
```

Start command is also correct:
```bash
npm run start
```

### 5. Custom Domain (Optional)

If you want to use a custom domain:
1. Go to "Settings" tab in your web service
2. Add your custom domain under "Custom Domains"
3. Follow DNS configuration instructions

## Troubleshooting

### Common Issues:

1. **Database Connection Timeout:**
   - Ensure both web service and database are in the same region
   - Check if database is fully provisioned (can take a few minutes)

2. **Build Failures:**
   - Check build logs for specific errors
   - Ensure all dependencies are listed in package.json

3. **Port Issues:**
   - The app correctly binds to `0.0.0.0:5000`
   - Render automatically detects the port

### Health Check

Once deployed, you can verify the deployment by:
1. Visiting your Render URL
2. Checking that the homepage loads correctly
3. Testing form submissions work properly

## Production Optimizations

For production use, consider:

1. **Database Scaling:** Upgrade to a paid PostgreSQL plan for better performance
2. **CDN:** Enable Render's CDN for static assets
3. **Monitoring:** Set up health checks and monitoring
4. **Backup:** Configure regular database backups

## Next Steps After Successful Deployment

1. Test all form submissions
2. Verify SmartSite API integration works
3. Check that all pages load correctly
4. Test contact forms and lead capture
5. Confirm analytics tracking is working

The deployment should work once the `DATABASE_URL` environment variable is properly configured.