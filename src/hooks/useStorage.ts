import {useCallback, useEffect, useState} from 'react';
import {getStorageData, saveStorageData} from '../tools/storage-tool.ts';

export function useStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const item = getStorageData(key);
      if (item) {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed)) {
          let restoredData;
          if (Array.isArray(initialValue) && initialValue.length > 0) {
            restoredData = parsed.map(item => ({
              ...initialValue[0],
              ...item,
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
              startTime: item.startTime ? new Date(item.startTime) : null,
              endTime: item.endTime ? new Date(item.endTime) : null,
            }));
          } else {
            restoredData = parsed.map(item => ({
              ...item,
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
              startTime: item.startTime ? new Date(item.startTime) : null,
              endTime: item.endTime ? new Date(item.endTime) : null,
            }));
          }

          setStoredValue(restoredData as T);
        } else {
          setStoredValue(parsed);
        }
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      setIsInitialized(true);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        saveStorageData(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    },
    [storedValue],
  );

  return [storedValue, setValue, !isInitialized] as const;
}
