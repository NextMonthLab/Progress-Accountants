#!/bin/bash
set -e

echo "🚀 Starting Progress Smart Site..."
echo "📁 Installing dependencies..."
npm install

echo "🔧 Building application..."
npm run build

echo "🌐 Starting server on port 5001..."
npm run dev