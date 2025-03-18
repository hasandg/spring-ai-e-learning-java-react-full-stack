#!/bin/bash

echo "🔄 Restarting frontend on port 3000..."

# Kill any process on ports 3000-3005
for port in {3000..3005}; do
  pid=$(lsof -t -i:$port 2>/dev/null)
  if [ ! -z "$pid" ]; then
    echo "Killing process on port $port (PID: $pid)"
    kill $pid 2>/dev/null || true
  fi
done
echo "✅ Killed existing processes on ports 3000-3005"

# Give it a moment to properly close
sleep 1

# Start frontend on port 3000
cd frontend
echo "🚀 Starting frontend on http://localhost:3000"
PORT=3000 npm run dev 