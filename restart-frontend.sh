#!/bin/bash

# Kill any process running on port 3000 or 3001
echo "Killing any process on ports 3000 and 3001..."
kill $(lsof -t -i:3000) 2>/dev/null || echo "No process on port 3000"
kill $(lsof -t -i:3001) 2>/dev/null || echo "No process on port 3001"

# Also kill any Next.js processes specifically
echo "Killing any Next.js processes..."
pkill -f "node.*/next" || echo "No Next.js processes found"

# Wait a moment to ensure the port is free
sleep 2

# Navigate to frontend directory and start the app
echo "Starting frontend..."
cd frontend && npm run dev

echo "Done" 