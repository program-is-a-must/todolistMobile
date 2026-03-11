import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const getApiBaseUrl = () => {
  const extraUrl =
    // @ts-ignore
    (Constants as any)?.expoConfig?.extra?.EXPO_PUBLIC_API_URL;
  const envUrl = process.env.EXPO_PUBLIC_API_URL || extraUrl;
  if (envUrl && envUrl.length > 0) {
    return envUrl.endsWith('/') ? `${envUrl}api` : `${envUrl}/api`;
  }
  const hostUri: string | undefined =
    // @ts-ignore newer expo
    (Constants as any)?.expoConfig?.hostUri ??
    // @ts-ignore legacy expo go
    (Constants as any)?.manifest?.debuggerHost ??
    (Constants as any)?.expoGoConfig?.debuggerHost;
  if (hostUri && typeof hostUri === 'string') {
    const host = hostUri.split(':')[0];
    if (/^\\d+\\.\\d+\\.\\d+\\.\\d+$/.test(host)) {
      return `http://${host}:8000/api`;
    }
  }
  const defaultHost =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8000'
      : 'http://127.0.0.1:8000';
  return `${defaultHost}/api`;
};

export const API_BASE_URL = getApiBaseUrl();

