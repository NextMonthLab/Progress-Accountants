#!/bin/bash
# Test static deployment without Docker

echo "Testing static deployment..."

# Start simple HTTP server
cd dist
python3 -m http.server 8080 &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Test health
echo "Testing site availability..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/

# Check for errors in console
echo "Site should be available at http://localhost:8080"

# Cleanup function
cleanup() {
    kill $SERVER_PID 2>/dev/null
}

trap cleanup EXIT

echo "Press any key to stop server..."
read -n 1