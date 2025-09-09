import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';

import AboutUs from '../app/AboutUs';
import ContactUs from '../app/ContactUs';
import LiveControlsScreen from '../app/LiveControlsScreen';
import PrivacyPolicy from '../app/PrivacyPolicy';
import ProfileScreen from '../app/ProfileScreen';
import TermsServices from '../app/TermsServices';
import VideoSettings from '../app/VideoSettings';
import CustomDrawerContent from '../components/sideBar';
import Tabs from './Tabs';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({ setIsLoggedIn }) {
  return (
    <Drawer.Navigator
      initialRouteName="HomeTabs"
      drawerContent={(props) => (
        <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
          <CustomDrawerContent {...props} setIsLoggedIn={setIsLoggedIn} />
        </SafeAreaView>
      )}
      screenOptions={{ headerShown: false }}
    >
      {/* Tabs (bottom tabs) – navigator: non-scrollable handled by App.js wrapper */}
      <Drawer.Screen name="HomeTabs" component={Tabs} />

      {/* Content screens – safe area & responsiveness already handled by App.js wrapper */}
      <Drawer.Screen name="Prof" component={ProfileScreen} />
      <Drawer.Screen
        name="LiveControlsSettings"
        component={LiveControlsScreen}
      />
      <Drawer.Screen name="VideoSettings" component={VideoSettings} />
      <Drawer.Screen name="ContactUs" component={ContactUs} />
      <Drawer.Screen name="AboutUs" component={AboutUs} />
      <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Drawer.Screen name="TermsServices" component={TermsServices} />
    </Drawer.Navigator>
  );
}
