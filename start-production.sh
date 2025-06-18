#!/bin/bash
# Production startup script for Replit deployment
export NODE_ENV=production
export PORT=5000

# Start the production server using tsx for TypeScript runtime
tsx server/index.ts