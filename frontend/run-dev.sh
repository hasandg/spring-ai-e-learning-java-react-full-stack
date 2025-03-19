#!/bin/bash
echo "Starting Next.js development server..."
export NODE_OPTIONS="--no-warnings --max-old-space-size=4096"
npx next dev 