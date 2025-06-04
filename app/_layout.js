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
// Layout.js

// import React from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';

// import HomeScreen from './HomeScreen';
// import ImagesScreen from './ImagesScreen';
// import LiveControlsScreen from './LiveControlsScreen';
// import MoistureSensingScreen from './MoistureSensingScreen';

// const Drawer = createDrawerNavigator();

// export default function Layout() {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Home"
//       screenOptions={{ headerShown: false }} // <-- yeh add karo
//     >
//       <Drawer.Screen name="Home" component={HomeScreen} />
//       <Drawer.Screen name="Images" component={ImagesScreen} />
//       <Drawer.Screen name="Live Controls" component={LiveControlsScreen} />
//       <Drawer.Screen
//         name="Moisture Sensing"
//         component={MoistureSensingScreen}
//       />
//     </Drawer.Navigator>
//   );
// }
