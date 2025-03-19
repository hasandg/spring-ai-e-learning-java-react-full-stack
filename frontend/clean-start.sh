#!/bin/bash

echo "======== CLEAN START E-LEARNING FRONTEND ========"
echo "Cleaning up old processes and caches..."

# Kill any existing Next.js processes
echo "🔄 Killing existing Next.js processes..."
pkill -f "node.*next" || echo "No Next.js processes found"

# Remove Next.js cache
echo "🔄 Clearing Next.js cache..."
rm -rf .next

# Remove node_modules cache (optional, uncomment if needed)
# echo "🔄 Clearing node_modules cache..."
# rm -rf node_modules/.cache

# Clear localStorage script to inject at startup
cat > clear-storage.js << EOL
// Script to clear localStorage on startup
console.log('Clearing browser storage...');

// List of keys to remove (add any additional keys your app uses)
const keysToRemove = [
  // Keycloak related
  'kc-token',
  'kc-refresh-token', 
  'keycloak-token',
  'keycloak-refresh-token',
  
  // App related
  'auth_token',
  'refresh_token',
  'user',
  'isAuthenticated',
  
  // Add any other keys your app uses
];

// Remove all listed keys
keysToRemove.forEach(key => {
  try {
    localStorage.removeItem(key);
    console.log(\`Removed \${key} from localStorage\`);
  } catch (e) {
    console.error(\`Failed to remove \${key}\`, e);
  }
});

console.log('Storage cleanup complete!');
EOL

echo "📝 Created storage clearing script"

# Display instructions
echo ""
echo "⚠️  IMPORTANT: To prevent automatic login issues, please:"
echo "1. Open your browser's developer tools (F12)"
echo "2. Go to the Application tab"
echo "3. Select 'Storage' > 'Local Storage'"
echo "4. Clear all items for this domain"
echo "5. Also clear cookies if needed"
echo ""

# Start the frontend
echo "🚀 Starting frontend in development mode..."
echo "✅ App will be available at http://localhost:3000"
echo ""

# Run Next.js with the custom environment
NODE_OPTIONS="--no-warnings" npm run dev 