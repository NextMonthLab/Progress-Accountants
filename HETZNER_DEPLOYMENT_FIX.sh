#!/bin/bash
# HETZNER DEPLOYMENT FIX - Progress Accountants
# Fixes repo consistency issue for container deployments

set -e

echo "🔧 RAPLET DEPLOYMENT FIX - Progress Accountants"
echo "==============================================="

# Configuration
CORRECT_REPO="https://github.com/Flashbuzz/Progress-Accountants.git"
DEPLOYMENT_DIR="/opt/progress-accountants"
BACKUP_DIR="/opt/backups/progress-$(date +%Y%m%d-%H%M%S)"

# Backup existing deployment
if [ -d "$DEPLOYMENT_DIR" ]; then
    echo "📦 Creating backup at $BACKUP_DIR"
    sudo mkdir -p "$(dirname "$BACKUP_DIR")"
    sudo cp -r "$DEPLOYMENT_DIR" "$BACKUP_DIR"
fi

# Clean deployment
echo "🧹 Cleaning deployment directory"
sudo rm -rf "$DEPLOYMENT_DIR"
sudo mkdir -p "$DEPLOYMENT_DIR"

# Clone correct repository
echo "📥 Cloning from correct repository: $CORRECT_REPO"
cd "$(dirname "$DEPLOYMENT_DIR")"
sudo git clone "$CORRECT_REPO" "$(basename "$DEPLOYMENT_DIR")"

# Verify repository integrity
cd "$DEPLOYMENT_DIR"
CURRENT_REPO=$(git remote get-url origin)
if [ "$CURRENT_REPO" != "$CORRECT_REPO" ]; then
    echo "❌ ERROR: Repository mismatch!"
    echo "Expected: $CORRECT_REPO"
    echo "Current: $CURRENT_REPO"
    exit 1
fi

# Lock to specific commit for stability
LATEST_COMMIT=$(git rev-parse HEAD)
echo "🔒 Locked to commit: $LATEST_COMMIT"

# Build frontend (if needed)
if [ -f "progress-frontend-clean/package.json" ]; then
    echo "🏗️ Building frontend"
    cd progress-frontend-clean
    npm install
    npm run build
    cd ..
fi

echo "✅ Deployment fix complete!"
echo "Repository: $CORRECT_REPO"
echo "Commit: $LATEST_COMMIT"
echo "Location: $DEPLOYMENT_DIR"