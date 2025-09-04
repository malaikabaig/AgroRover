// App.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './app/LoginScreen';
import SignupScreen from './app/SignupScreen';
import DrawerNavigator from './navigation/drawerNavigator';

const Stack = createNativeStackNavigator();

// splash ko auto-hide mat hone do jab tak hum ready na ho jayen
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = checking token

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (alive) setIsLoggedIn(!!token);
      } finally {
        // token check complete → splash hide
        // chhota sa delay optionally (UI jhatka avoid)
        setTimeout(() => SplashScreen.hideAsync().catch(() => {}), 50);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (isLoggedIn === null) {
    // NOTE: Splash abhi visible hai; yahan kuch render bhi kar do to chalega
    return (
      <PaperProvider>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#E8F5E9',
          }}
        >
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <>
              <Stack.Screen name="Login">
                {(props) => (
                  <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />
                )}
              </Stack.Screen>
              <Stack.Screen name="Signup">
                {(props) => (
                  <SignupScreen {...props} setIsLoggedIn={setIsLoggedIn} />
                )}
              </Stack.Screen>
            </>
          ) : (
            <Stack.Screen name="MainApp">
              {(props) => (
                <DrawerNavigator {...props} setIsLoggedIn={setIsLoggedIn} />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
