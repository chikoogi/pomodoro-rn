import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const saveStorageData = (key:string, value:string) => {
  try {
    storage.set(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

export const getStorageData = (key:string) => {
  try {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};

export const removeStorageData = (key:string) => {
  try {
    storage.delete(key);
  } catch (error) {
    console.error('Failed to remove data:', error);
  }
};