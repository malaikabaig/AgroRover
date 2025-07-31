import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function CustomDrawerContent({
  setIsLoggedIn,
  navigation,
  ...props
}) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setIsLoggedIn(false);
    navigation.navigate('Login'); // 👈 Corrected from 'LoginScreen'
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
          onPress={() => navigation.navigate('Prof')}
        />
        <DrawerItem
          label="Live Controls"
          onPress={() => navigation.navigate('LiveControlsSettings')}
        />
        <DrawerItem
          label="Video Settings"
          onPress={() => navigation.navigate('VideoSettings')}
        />
        <DrawerItem
          label="Contact Us"
          onPress={() => navigation.navigate('ContactUs')}
        />
        <DrawerItem
          label="About Us"
          onPress={() => navigation.navigate('AboutUs')}
        />
      </View>

      <View>
        <DrawerItem
          label="Privacy Policy"
          onPress={() => navigation.navigate('PrivacyPolicy')}
        />
        <DrawerItem
          label="Terms & Services"
          onPress={() => navigation.navigate('TermsServices')}
        />
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
  profileName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  roverId: {
    color: '#A5D6A7',
    fontSize: 14,
  },
});
