import { SERVER_IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  DeviceEventEmitter,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import HeaderBar from '../components/headerBar';

const NODE_BASE_URL = SERVER_IP;

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null); // { email, username, roverId, avatarUrl }
  const [image, setImage] = useState(null);
  const [imagePicked, setImagePicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // ------------------- Load profile on mount -------------------
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${NODE_BASE_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setProfile(data); // should include { email, username, roverId, avatarUrl }
        } else {
          Alert.alert('Error', data.message || 'Could not fetch profile');
        }
      } catch (err) {
        Alert.alert('Error', 'Network error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ------------------- Pick Image -------------------
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setImagePicked(true);
    }
  };

  // ------------------- Submit Image -------------------
  const handleSubmit = async () => {
    if (!image) {
      Alert.alert('Error', 'Please pick an image before submitting');
      return;
    }

    try {
      setUploading(true);
      const token = await AsyncStorage.getItem('token');

      const formData = new FormData();
      formData.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      });

      const res = await fetch(`${NODE_BASE_URL}/api/profile/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Avatar updated successfully');
        setProfile((prev) => ({ ...prev, avatarUrl: data.avatarUrl }));

        // ✅ Make header & drawer update instantly
        await AsyncStorage.setItem('avatarUrl', data.avatarUrl);
        DeviceEventEmitter.emit('profile:avatarUpdated', {
          avatarUrl: data.avatarUrl,
        });

        setImagePicked(false);
        setImage(null);
      } else {
        Alert.alert('Upload Failed', data.message || 'Try again later');
      }
    } catch (err) {
      Alert.alert('Error', 'Upload failed, try again');
    } finally {
      setUploading(false);
    }
  };

  // ------------------- UI -------------------
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <>
      <HeaderBar title="Profile" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>{profile?.username || '-'}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile?.email || '-'}</Text>

        <Text style={styles.label}>Rover ID</Text>
        <Text style={styles.value}>{profile?.roverId || '-'}</Text>

        <Text style={styles.label}>Avatar</Text>

        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : profile?.avatarUrl ? (
          <Image source={{ uri: profile.avatarUrl }} style={styles.image} />
        ) : (
          <Text style={styles.noImageText}>No avatar yet</Text>
        )}

        <View style={styles.btnRow}>
          <Button title="Pick Image" onPress={pickImage} />
          {imagePicked && (
            <Button
              title={uploading ? 'Uploading...' : 'Submit'}
              onPress={handleSubmit}
              disabled={uploading}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2E7D32',
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginVertical: 20,
    alignSelf: 'center',
  },
  noImageText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
  },
  btnRow: {
    alignItems: 'center',
    gap: 10,
  },
});
