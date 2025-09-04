import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DrawerContentScrollView,
  DrawerItem,
  useDrawerStatus,
} from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  DeviceEventEmitter,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function CustomDrawerContent({
  setIsLoggedIn,
  navigation,
  ...props
}) {
  const [profile, setProfile] = useState({
    name: '',
    roverId: '',
    avatarUrl: '',
  });
  const drawerStatus = useDrawerStatus();

  const cacheBust = (url) =>
    url ? `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}` : url;

  const loadProfileFromStorage = useCallback(async () => {
    try {
      const roverId = await AsyncStorage.getItem('roverId');
      const username = await AsyncStorage.getItem('username');
      const name = await AsyncStorage.getItem('name');
      const avatarUrl = await AsyncStorage.getItem('avatarUrl');

      const displayName = username || name || 'User';

      setProfile({
        name: displayName,
        roverId: roverId || 'Unknown',
        avatarUrl: cacheBust(
          avatarUrl ||
            `https://i.pravatar.cc/100?u=${encodeURIComponent(displayName)}`
        ),
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  }, []);

  // Refresh when drawer gains focus
  useFocusEffect(
    useCallback(() => {
      loadProfileFromStorage();
    }, [loadProfileFromStorage])
  );

  // Also refresh when drawer opens
  useEffect(() => {
    if (drawerStatus === 'open') loadProfileFromStorage();
  }, [drawerStatus, loadProfileFromStorage]);

  // Instant avatar updates coming from ProfileScreen
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      'profile:avatarUpdated',
      ({ avatarUrl }) => {
        setProfile((p) => ({ ...p, avatarUrl: cacheBust(avatarUrl) }));
        AsyncStorage.setItem('avatarUrl', avatarUrl).catch(() => {});
      }
    );
    return () => sub.remove();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove([
      'token',
      'name',
      'username',
      'roverId',
      'avatarUrl',
    ]);
    // ❌ Don’t navigate to 'Login' from here; let the root switch on isLoggedIn
    setIsLoggedIn(false);
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
    >
      <View>
        <View style={styles.profileSection}>
          <Image
            key={profile.avatarUrl}
            source={{ uri: profile.avatarUrl }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.roverId}>Rover ID: {profile.roverId}</Text>
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
  profileImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  profileName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  roverId: { color: '#A5D6A7', fontSize: 14 },
});
