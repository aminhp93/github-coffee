import { useEffect, useState } from "react";

export function useLocalStorageState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(defaultValue);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        setState(JSON.parse(storedValue));
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  }, [key]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [key, state]);

  return [state, setState] as const;
}
