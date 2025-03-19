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
    console.log(`Removed ${key} from localStorage`);
  } catch (e) {
    console.error(`Failed to remove ${key}`, e);
  }
});

console.log('Storage cleanup complete!');
