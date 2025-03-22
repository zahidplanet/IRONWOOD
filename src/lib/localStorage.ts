// Basic localStorage utility functions for data persistence

// Check if we're in a browser or Electron environment
const isClient = typeof window !== 'undefined';

/**
 * Get data from localStorage
 * @param key The key to retrieve data for
 * @param defaultValue Default value if key doesn't exist
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (!isClient) return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    // Check if the item exists
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Save data to localStorage
 * @param key The key to store data under
 * @param value The value to store
 */
export function saveToStorage<T>(key: string, value: T): void {
  if (!isClient) return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving item ${key} to localStorage:`, error);
  }
}

/**
 * Remove data from localStorage
 * @param key The key to remove
 */
export function removeFromStorage(key: string): void {
  if (!isClient) return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
  }
}

/**
 * Clear all data from localStorage
 */
export function clearStorage(): void {
  if (!isClient) return;
  
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

// Storage keys
export const STORAGE_KEYS = {
  OWNER_DASHBOARD_DATA: 'ironwood_owner_dashboard',
  PHYSICIAN_DASHBOARD_DATA: 'ironwood_physician_dashboard',
  USER_PREFERENCES: 'ironwood_user_preferences',
}; 