import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function CustomDrawerContent({ setIsLoggedIn, ...props }) {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token'); // Token remove karo
    setIsLoggedIn(false); // Login state reset karo
    router.replace('/LoginScreen'); // LoginScreen route par redirect karo
  };

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
        {/* Sign Out Drawer Item */}
        <DrawerItem label="Sign Out" onPress={handleLogout} />

        <Text style={{ textAlign: 'center', marginBottom: 12, color: '#999' }}>
          © 2025 AgroRover
        </Text>
      </View>
    </DrawerContentScrollView>
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
