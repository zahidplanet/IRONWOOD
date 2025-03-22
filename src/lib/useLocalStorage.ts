import { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from './localStorage';

/**
 * React hook for using localStorage
 * @param key Storage key
 * @param initialValue Default value to use if not found in storage
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error('Error parsing storage:', error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T) => {
    // Save state
    setStoredValue(value);
    // Save to localStorage
    saveToStorage(key, value);
  };

  // Update stored value if local storage changes in another window/tab
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.error('Error parsing storage change:', error);
        }
      }
    };

    // Listen for storage events (only triggered in other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [initialValue, key]);

  return [storedValue, setValue];
} 