import { Tabs } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import DrawerNavigator from '../components/drawerNavigator';

export default function Layout() {
  return (
    <PaperProvider>
      <DrawerNavigator>
        <Tabs screenOptions={{ headerShown: false }}>
          <Tabs.Screen name="HomeScreen" options={{ title: 'Home' }} />
          <Tabs.Screen
            name="LiveControlsScreen"
            options={{ title: 'Live Controls' }}
          />
          <Tabs.Screen name="ImagesScreen" options={{ title: 'Images' }} />
          <Tabs.Screen
            name="MoistureSensingScreen"
            options={{ title: 'Moisture' }}
          />
        </Tabs>
      </DrawerNavigator>
    </PaperProvider>
  );
}
