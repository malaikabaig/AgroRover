import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../app/HomeScreen';
import ImagesScreen from '../app/ImagesScreen';
import LiveControlsScreen from '../app/LiveControlsScreen';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'LiveControls') iconName = 'gamepad-variant';
          else if (route.name === 'Images') iconName = 'image-album';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="LiveControls" component={LiveControlsScreen} />
      <Tab.Screen name="Images" component={ImagesScreen} />
    </Tab.Navigator>
  );
}
