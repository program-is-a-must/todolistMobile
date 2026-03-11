import { Platform } from 'react-native';

let memoryToken: string | null = null;

export function getStoredToken(): string | null {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window) {
      return window.localStorage.getItem('auth_token');
    }
  } catch {}
  return memoryToken;
}

export function setStoredToken(token: string | null) {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window) {
      if (token) {
        window.localStorage.setItem('auth_token', token);
      } else {
        window.localStorage.removeItem('auth_token');
      }
      return;
    }
  } catch {}
  memoryToken = token;
}

