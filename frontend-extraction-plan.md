# Progress Accountants Frontend Extraction Plan

## Files to Extract
- client/ → root directory
- vite.config.ts
- tailwind.config.ts  
- postcss.config.js
- package.json (cleaned)
- .env.example

## Files to Remove/Exclude
- server/ (entire backend)
- drizzle.config.ts
- shared/ (unless types needed)
- Backend dependencies
- Admin routes and auth

## Configuration Updates
1. Update API calls to use VITE_API_URL
2. Handle auth gracefully for public demo
3. Clean package.json scripts
4. Add demo labeling
5. Remove admin navigation

## Build Target
- Static Vite build for Hetzner/Netlify deployment
- No backend dependencies
- Clean demo site ready for production