// Fix: Import React to provide the 'React' namespace for type annotations.
import React, { useState, useEffect } from 'react';

export function useLocalStorage<T extends object>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      const storedItem = item ? JSON.parse(item) : initialValue;
      
      // FIX: Do not spread arrays into an object. Only merge if the value is a non-array object.
      if (Array.isArray(initialValue)) {
        return storedItem;
      }
      
      // Merge initialValue with storedItem to ensure new keys from updates are included for existing users.
      // This is for objects like settings.
      return { ...initialValue, ...storedItem };
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const valueToStore = typeof storedValue === 'function' ? storedValue(storedValue) : storedValue;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}