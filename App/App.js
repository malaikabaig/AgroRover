import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import LoginScreen from './app/LoginScreen';
import SignupScreen from './app/SignupScreen';
import DrawerNavigator from './navigation/drawerNavigator';

const Stack = createNativeStackNavigator();

// Universal SafeArea + Keyboard + optional Scroll wrapper
function ScreenWrapper({ children, scrollable = true }) {
  const insets = useSafeAreaInsets();
  const Content = scrollable ? ScrollView : View;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top / 2, // Reduced top padding
        paddingBottom: 0, // Remove bottom padding for a tighter layout
      }}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Content
          style={{ flex: 1 }}
          contentContainerStyle={
            scrollable
              ? { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 20 } // Reduced vertical padding for a tighter layout
              : undefined
          }
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </Content>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Prevent splash screen from auto-hiding until we're ready
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
        // token check complete → splash hide (slight delay to avoid visual jolt)
        setTimeout(() => SplashScreen.hideAsync().catch(() => {}), 50);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (isLoggedIn === null) {
    // NOTE: Splash is still visible; render a loading screen while checking token
    return (
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isLoggedIn ? (
              <>
                <Stack.Screen name="Login">
                  {(props) => (
                    <ScreenWrapper scrollable>
                      <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />
                    </ScreenWrapper>
                  )}
                </Stack.Screen>
                <Stack.Screen name="Signup">
                  {(props) => (
                    <ScreenWrapper scrollable>
                      <SignupScreen {...props} setIsLoggedIn={setIsLoggedIn} />
                    </ScreenWrapper>
                  )}
                </Stack.Screen>
              </>
            ) : (
              <Stack.Screen name="MainApp">
                {(props) => (
                  // Navigators handle their own scrolling, so use non-scrollable wrapper
                  <ScreenWrapper scrollable={false}>
                    <DrawerNavigator {...props} setIsLoggedIn={setIsLoggedIn} />
                  </ScreenWrapper>
                )}
              </Stack.Screen>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
