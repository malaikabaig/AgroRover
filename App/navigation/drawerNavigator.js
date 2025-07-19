import { createDrawerNavigator } from '@react-navigation/drawer';
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
      drawerContent={(props) => (
        <CustomDrawerContent {...props} setIsLoggedIn={setIsLoggedIn} />
      )}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="HomeTabs" component={Tabs} />
      <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
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
