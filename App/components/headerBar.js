import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Appbar, Avatar } from 'react-native-paper';

export default function HeaderBar({ title, onBack }) {
  const navigation = useNavigation();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [fallbackSeed, setFallbackSeed] = useState('user'); // for pravatar fallback
  const fallbackUrl = `https://i.pravatar.cc/150?u=${encodeURIComponent(fallbackSeed)}`;

  // Load avatarUrl (and email for fallback) whenever the header/screen gains focus
  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        try {
          const [storedAvatar, email] = await Promise.all([
            AsyncStorage.getItem('avatarUrl'),
            AsyncStorage.getItem('email'),
          ]);
          if (!mounted) return;
          setAvatarUrl(storedAvatar || null);
          setFallbackSeed(email || 'user');
        } catch (e) {
          // ignore
        }
      })();
      return () => {
        mounted = false;
      };
    }, [])
  );

  // If avatar fails to load, fall back to pravatar
  const handleAvatarError = () => {
    setAvatarUrl(null);
  };

  return (
    <Appbar.Header style={{ backgroundColor: '#2E7D32' }}>
      {/* Back Button - Only shows if onBack is passed */}
      {onBack ? (
        <Appbar.Action
          icon={() => <Ionicons name="arrow-back" size={24} color="white" />}
          onPress={onBack}
        />
      ) : (
        /* Menu Button */
        <Appbar.Action
          icon="menu"
          color="white"
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
      )}

      {/* Title */}
      <Appbar.Content
        title={title}
        titleStyle={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}
      />

      {/* Avatar: prefer uploaded image; else pravatar fallback */}
      <Avatar.Image
        size={36}
        source={{ uri: avatarUrl || fallbackUrl }}
        onError={handleAvatarError}
        style={{ marginRight: 10 }}
      />
    </Appbar.Header>
  );
}
