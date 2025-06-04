import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { Button, Input } from 'react-native-paper';

const Drawer = createDrawerNavigator();

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>User Profile Screen</Text>
  </View>
);
const LiveControlsSettings = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Live Controls Settings</Text>
  </View>
);
const VideoSettings = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Video Settings</Text>
  </View>
);
const ContactUs = () => (
  <View style={{ flex: 1, padding: 16 }}>
    <Text style={{ fontSize: 18, marginBottom: 8 }}>Contact Us</Text>
    {/* Simplified contact form */}
    <Text>Email:</Text>
    <Input placeholder="Your email" />
    <Text>Message:</Text>
    <Input multiline numberOfLines={4} placeholder="Your message" />
    <Button mode="contained" onPress={() => Alert.alert('Form Submitted')}>
      Submit
    </Button>
  </View>
);
const AboutUs = () => (
  <View style={{ flex: 1, padding: 16 }}>
    <Text style={{ fontSize: 18, marginBottom: 8 }}>About AgroRover</Text>
    <Text>
      This is an AI-based automated farming rover project built with React
      Native and Expo.
    </Text>
  </View>
);
const PrivacyPolicy = () => (
  <View style={{ flex: 1, padding: 16 }}>
    <Text>Privacy Policy content here...</Text>
  </View>
);
const TermsServices = () => (
  <View style={{ flex: 1, padding: 16 }}>
    <Text>Terms & Services content here...</Text>
  </View>
);

function CustomDrawerContent(props) {
  const router = useRouter();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
    >
      <View>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100' }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.roverId}>Rover ID: #12345</Text>
        </View>

        <DrawerItem
          label="Profile"
          onPress={() => router.push('/ProfileScreen')}
        />
        <DrawerItem
          label="Live Controls"
          onPress={() => router.push('/LiveControlsSettings')}
        />
        <DrawerItem
          label="Video Settings"
          onPress={() => router.push('/VideoSettings')}
        />
        <DrawerItem
          label="Contact Us"
          onPress={() => router.push('/ContactUs')}
        />
        <DrawerItem label="About Us" onPress={() => router.push('/AboutUs')} />
      </View>

      <View>
        <DrawerItem
          label="Privacy Policy"
          onPress={() => router.push('/PrivacyPolicy')}
        />
        <DrawerItem
          label="Terms & Services"
          onPress={() => router.push('/TermsServices')}
        />
        <Text style={{ textAlign: 'center', marginBottom: 12, color: '#999' }}>
          © 2025 AgroRover
        </Text>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator({ children }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Tabs">{() => children}</Drawer.Screen>

      <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
      <Drawer.Screen
        name="LiveControlsSettings"
        component={LiveControlsSettings}
      />
      <Drawer.Screen name="VideoSettings" component={VideoSettings} />
      <Drawer.Screen name="ContactUs" component={ContactUs} />
      <Drawer.Screen name="AboutUs" component={AboutUs} />
      <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Drawer.Screen name="TermsServices" component={TermsServices} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    padding: 16,
    backgroundColor: '#2E7D32',
    marginBottom: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  profileName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  roverId: { color: '#A5D6A7', fontSize: 14 },
});
