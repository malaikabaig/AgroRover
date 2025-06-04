// // navigation/Tabs.js
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from '../app/HomeScreen';
// import ImagesScreen from '../app/ImagesScreen';
// import LiveControlsScreen from '../app/LiveControlsScreen';
// import MoistureSensorScreen from '../app/MoistureSensingScreen';

// const Tab = createBottomTabNavigator();

// const Tabs = () => {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Images" component={ImagesScreen} />
//       <Tab.Screen name="Live Controls" component={LiveControlsScreen} />
//       <Tab.Screen name="Moisture" component={MoistureSensorScreen} />
//     </Tab.Navigator>
//   );
// };

// export default Tabs;

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from '../app/HomeScreen';
// import ImagesScreen from '../app/ImagesScreen';
// import LiveControlsScreen from '../app/LiveControlsScreen';
// import MoistureSensorScreen from '../app/MoistureSensingScreen';

// const Tab = createBottomTabNavigator();

// export default function Tabs() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Images" component={ImagesScreen} />
//       <Tab.Screen name="Live Controls" component={LiveControlsScreen} />
//       <Tab.Screen name="Moisture" component={MoistureSensorScreen} />
//     </Tab.Navigator>
//   );
// }

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../app/HomeScreen';
import ImagesScreen from '../app/ImagesScreen';
import LiveControlsScreen from '../app/LiveControlsScreen';
import MoistureSensingScreen from '../app/MoistureSensingScreen';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true, // har tab ke upar header show kare
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Images" component={ImagesScreen} />
      <Tab.Screen name="Live Controls" component={LiveControlsScreen} />
      <Tab.Screen name="Moisture" component={MoistureSensingScreen} />
    </Tab.Navigator>
  );
}
