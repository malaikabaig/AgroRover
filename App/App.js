import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import LoginScreen from './app/LoginScreen';
import SignupScreen from './app/SignupScreen';
import DrawerNavigator from './navigation/drawerNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
