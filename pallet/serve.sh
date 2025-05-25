#!/bin/bash
set -e

echo "🚀 Starting Progress Smart Site (Hetzner-Ready)"
echo "📁 Installing dependencies..."

# Install dependencies
npm install

echo "🔧 Building application..."
# Build the client
npm run build

echo "🌐 Starting server on port 5000..."
# Start the application
PORT=5000 npm start