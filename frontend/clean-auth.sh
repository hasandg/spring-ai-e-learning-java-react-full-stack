#!/bin/bash

echo "========== CLEANING AUTHENTICATION STATE =========="
echo "This script will clean all auth-related caches and restart the application"

# Kill all Next.js processes
echo "🔄 Killing Next.js processes..."
pkill -f "node.*next" || echo "No Next.js processes found"

# Clean Next.js cache
echo "🔄 Removing Next.js cache..."
rm -rf .next

# Create cache-clearing script
echo "📝 Creating a cache-clearing script for the browser..."
cat > public/clear-cache.js << EOL
// This script runs in the browser when loaded
console.log('Clearing browser storage for auth...');

// Clear localStorage
const keysToRemove = [
  'kc-token',
  'kc-refresh-token',
  'auth_token',
  'refresh_token',
  'user',
  'isAuthenticated',
  'keycloak',
  'kc-callback',
  // Add any other keys that might be causing issues
];

keysToRemove.forEach(key => {
  try {
    localStorage.removeItem(key);
    console.log('Removed', key, 'from localStorage');
  } catch (e) {
    console.error('Failed to remove', key, e);
  }
});

// Clear sessionStorage
try {
  sessionStorage.clear();
  console.log('Cleared sessionStorage');
} catch (e) {
  console.error('Failed to clear sessionStorage', e);
}

// Delete cookies related to auth
document.cookie.split(';').forEach(cookie => {
  const name = cookie.trim().split('=')[0];
  if (name.includes('auth') || name.includes('token') || name.includes('kc')) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    console.log('Deleted cookie:', name);
  }
});

console.log('Storage cleanup complete! Reload the page to continue.');
EOL

echo "🌐 To fully clear auth state, please:"
echo "1. Open your browser at http://localhost:3000/clear-cache.js"
echo "2. Open browser dev tools (F12) and check the console output"
echo "3. Reload the page and try again"

# Restart the app
echo "🚀 Starting Next.js in development mode..."
NODE_OPTIONS="--no-warnings" npm run dev 