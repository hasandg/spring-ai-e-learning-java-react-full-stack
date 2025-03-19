#!/bin/bash

echo "Restarting Next.js frontend application..."

# Kill any existing Next.js processes
echo "Killing existing Next.js processes..."
pkill -f "node.*next" || echo "No Next.js processes found"

# Clear Next.js cache
echo "Clearing Next.js cache..."
rm -rf .next

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the frontend in development mode
echo "Starting frontend..."
npm run dev 