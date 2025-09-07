// app/config.js
import Constants from 'expo-constants';

const extra =
  Constants.expoConfig?.extra ||
  Constants.manifest?.extra ||
  Constants.manifest2?.extra?.expoClient?.extra ||
  {};

export const SERVER_IP = String(
  extra.SERVER_IP || 'https://agrorover.vercel.app'
).replace(/\/+$/, '');

export const PI_URL = String(extra.PIURL || '').replace(/\/+$/, '');
export const GOOGLE_EXPO_CLIENT_ID = String(extra.GOOGLE_EXPO_CLIENT_ID || '');
export const GOOGLE_ANDROID_CLIENT_ID = String(
  extra.GOOGLE_ANDROID_CLIENT_ID || ''
);
