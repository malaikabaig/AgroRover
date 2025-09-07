// app.config.js
import 'dotenv/config';
console.log('[CONFIG] SERVER_IP =', process.env.SERVER_IP);
export default {
  expo: {
    name: 'AGROROVER',
    slug: 'AGROROVER',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    scheme: 'agrorover',

    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.agrorover.app',
    },

    android: {
      package: 'com.anonymous.AGROROVER',
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      // Play Store ke liye har release pe isko +1 karo
      versionCode: 1,
    },

    web: {
      favicon: './assets/favicon.png',
    },

    plugins: [
      [
        'expo-splash-screen',
        {
          image: './assets/splash.png',
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
    ],

    updates: {
      enabled: true,
      fallbackToCacheTimeout: 0,
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },

    extra: {
      SERVER_IP: process.env.SERVER_IP,
      PIURL: process.env.PIURL,
      GOOGLE_EXPO_CLIENT_ID: process.env.GOOGLE_EXPO_CLIENT_ID,
      GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
      eas: {
        projectId: '242ec28f-73d6-4ec5-b1d3-a570c85a3563',
      },
    },
  },
};
