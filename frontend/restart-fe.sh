#!/bin/bash

# Kill any running Next.js processes
echo "Killing existing Next.js processes..."
pkill -f "node.*/next" || echo "No Next.js processes found to kill"

# Start the frontend
echo "Starting frontend..."
npm run dev 