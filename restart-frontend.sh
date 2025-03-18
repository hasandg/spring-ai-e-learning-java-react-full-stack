#!/bin/bash

# Kill any process running on port 3000
echo "Killing any process on port 3000..."
kill $(lsof -t -i:3000) 2>/dev/null || true

# Wait a moment to ensure the port is free
sleep 1

# Navigate to frontend directory and start the app on port 3000
echo "Starting frontend on port 3000..."
cd frontend && PORT=3000 npm run dev

echo "Done" 