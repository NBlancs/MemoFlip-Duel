import AsyncStorage from '@react-native-async-storage/async-storage';

type WebStorage = {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem?: (name: string) => void;
};

const getWebStorage = (): WebStorage | undefined => {
  const maybeStorage = globalThis as typeof globalThis & { localStorage?: WebStorage };
  return maybeStorage.localStorage;
};

export const storageService = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return getWebStorage()?.getItem(key) ?? null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
      return;
    } catch {
      getWebStorage()?.setItem(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      return;
    } catch {
      getWebStorage()?.removeItem?.(key);
    }
  },
};