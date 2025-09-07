// import { SERVER_IP } from '@env';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as ImagePicker from 'expo-image-picker';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Button,
//   DeviceEventEmitter,
//   Image,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import HeaderBar from '../components/headerBar';

// const NODE_BASE_URL = SERVER_IP;

// export default function ProfileScreen({ navigation }) {
//   const [profile, setProfile] = useState(null); // { email, username, roverId, avatarUrl }
//   const [image, setImage] = useState(null);
//   const [imagePicked, setImagePicked] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);

//   // ------------------- Load profile on mount -------------------
//   useEffect(() => {
//     (async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const res = await fetch(`${NODE_BASE_URL}/api/profile/me`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await res.json();
//         if (res.ok) {
//           setProfile(data); // should include { email, username, roverId, avatarUrl }
//         } else {
//           Alert.alert('Error', data.message || 'Could not fetch profile');
//         }
//       } catch (err) {
//         Alert.alert('Error', 'Network error');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // ------------------- Pick Image -------------------
//   const pickImage = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) {
//       alert('Permission to access camera roll is required!');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 4],
//       quality: 1,
//     });

//     if (!result.canceled && result.assets && result.assets.length > 0) {
//       setImage(result.assets[0].uri);
//       setImagePicked(true);
//     }
//   };

//   // ------------------- Submit Image -------------------
//   const handleSubmit = async () => {
//     if (!image) {
//       Alert.alert('Error', 'Please pick an image before submitting');
//       return;
//     }

//     try {
//       setUploading(true);
//       const token = await AsyncStorage.getItem('token');

//       const formData = new FormData();
//       formData.append('image', {
//         uri: image,
//         type: 'image/jpeg',
//         name: 'avatar.jpg',
//       });

//       const res = await fetch(`${NODE_BASE_URL}/api/profile/image`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//         body: formData,
//       });

//       const data = await res.json();
//       if (res.ok) {
//         Alert.alert('Success', 'Avatar updated successfully');
//         setProfile((prev) => ({ ...prev, avatarUrl: data.avatarUrl }));

//         // ✅ Make header & drawer update instantly
//         await AsyncStorage.setItem('avatarUrl', data.avatarUrl);
//         DeviceEventEmitter.emit('profile:avatarUpdated', {
//           avatarUrl: data.avatarUrl,
//         });

//         setImagePicked(false);
//         setImage(null);
//       } else {
//         Alert.alert('Upload Failed', data.message || 'Try again later');
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Upload failed, try again');
//     } finally {
//       setUploading(false);
//     }
//   };

//   // ------------------- UI -------------------
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#2E7D32" />
//       </View>
//     );
//   }

//   return (
//     <>
//       <HeaderBar title="Profile" onBack={() => navigation.goBack()} />
//       <View style={styles.container}>
//         <Text style={styles.label}>Username</Text>
//         <Text style={styles.value}>{profile?.username || '-'}</Text>

//         <Text style={styles.label}>Email</Text>
//         <Text style={styles.value}>{profile?.email || '-'}</Text>

//         <Text style={styles.label}>Rover ID</Text>
//         <Text style={styles.value}>{profile?.roverId || '-'}</Text>

//         <Text style={styles.label}>Avatar</Text>

//         {image ? (
//           <Image source={{ uri: image }} style={styles.image} />
//         ) : profile?.avatarUrl ? (
//           <Image source={{ uri: profile.avatarUrl }} style={styles.image} />
//         ) : (
//           <Text style={styles.noImageText}>No avatar yet</Text>
//         )}

//         <View style={styles.btnRow}>
//           <Button title="Pick Image" onPress={pickImage} />
//           {imagePicked && (
//             <Button
//               title={uploading ? 'Uploading...' : 'Submit'}
//               onPress={handleSubmit}
//               disabled={uploading}
//             />
//           )}
//         </View>
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   label: {
//     marginTop: 10,
//     fontWeight: 'bold',
//     fontSize: 16,
//     color: '#2E7D32',
//   },
//   value: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   image: {
//     width: 180,
//     height: 180,
//     borderRadius: 90,
//     marginVertical: 20,
//     alignSelf: 'center',
//   },
//   noImageText: {
//     textAlign: 'center',
//     color: '#888',
//     marginVertical: 20,
//   },
//   btnRow: {
//     alignItems: 'center',
//     gap: 10,
//   },
// });

import { ROVER_IP, SERVER_IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  DeviceEventEmitter,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import HeaderBar from '../components/headerBar';

const NODE_BASE_URL = (SERVER_IP || '').replace(/\/+$/, ''); // your main API (profile/avatar)
const ROVER_BASE_URL = (ROVER_IP || '').replace(/\/+$/, '') || NODE_BASE_URL; // rover Flask API (wifi endpoints)

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null); // { email, username, roverId, avatarUrl }
  const [image, setImage] = useState(null);
  const [imagePicked, setImagePicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // ---- Wi-Fi state ----
  const [wifiLoading, setWifiLoading] = useState(false);
  const [networks, setNetworks] = useState([]);
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [wifiStatus, setWifiStatus] = useState(null); // text banner

  // ------------------- Load profile on mount -------------------
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${NODE_BASE_URL}/api/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setProfile(data);
        else Alert.alert('Error', data.message || 'Could not fetch profile');
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

  // ------------------- Rover Wi-Fi: API helpers -------------------
  const wifiConnect = async () => {
    if (!ssid.trim()) {
      Alert.alert('Missing SSID', 'Please select or enter a Wi-Fi name.');
      return;
    }
    try {
      setConnecting(true);
      setWifiStatus('Connecting…');
      const res = await fetch(`${ROVER_BASE_URL}/api/wifi/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ssid: ssid.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false || data.status === 'failed') {
        throw new Error(data.error || 'connect_failed');
      }
      // success → poll status
      setWifiStatus(`Connected to ${data.ssid}`);
      Alert.alert('Success', `Rover connected to ${data.ssid}`);
    } catch (e) {
      setWifiStatus('Failed');
      Alert.alert(
        'Failed to connect',
        e.message || 'Please verify credentials and try again.'
      );
    } finally {
      setConnecting(false);
      // Reset wifiStatus after a certain delay
      setTimeout(() => {
        setWifiStatus(''); // Clear the status after 5 seconds
      }, 5000);
    }
  };

  // Auto-load nearby networks when entering the screen
  useEffect(() => {
    // Removed the scan function as you requested
  }, []);

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
      <ScrollView contentContainerStyle={styles.container}>
        {/* -------- Profile Card -------- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Profile</Text>
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
            <Button title="Pick Image" onPress={pickImage} color="#2E7D32" />
            {imagePicked && (
              <Button
                title={uploading ? 'Uploading...' : 'Submit'}
                onPress={handleSubmit}
                disabled={uploading}
                color="#2E7D32"
              />
            )}
          </View>
        </View>

        {/* -------- Rover Wi-Fi Card -------- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Set your Wi-Fi on your Rover</Text>

          <View style={styles.fieldRow}>
            <Text style={styles.inputLabel}>SSID</Text>
            <TextInput
              value={ssid}
              onChangeText={setSsid}
              placeholder="Select from list or type SSID"
              placeholderTextColor="#9E9E9E"
              style={styles.input}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Wi-Fi password (if any)"
              placeholderTextColor="#9E9E9E"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <View style={styles.actionsRow}>
            <Pressable
              onPress={wifiConnect}
              style={styles.primaryBtn}
              disabled={connecting}
            >
              {connecting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>Connect</Text>
              )}
            </Pressable>
          </View>

          {!!wifiStatus && <Text style={styles.statusText}>{wifiStatus}</Text>}
        </View>
      </ScrollView>
    </>
  );
}

const ACCENT = '#2E7D32';
const BORDER = '#E0E0E0';
const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#616161';
const BG_CARD = '#FFFFFF';

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center' },

  container: { flex: 1, padding: 16, backgroundColor: '#F7F9FB', gap: 16 },

  card: {
    backgroundColor: BG_CARD,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 8,
  },

  label: { marginTop: 8, fontWeight: '700', fontSize: 14, color: ACCENT },
  value: { fontSize: 15, marginBottom: 8, color: TEXT_DARK },

  image: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginVertical: 16,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: ACCENT,
  },
  noImageText: { textAlign: 'center', color: TEXT_MUTED, marginVertical: 16 },

  btnRow: { alignItems: 'center', gap: 10 },

  fieldRow: { marginTop: 8 },
  inputLabel: { color: ACCENT, fontWeight: '700', marginBottom: 6 },
  input: {
    backgroundColor: '#FAFAFA',
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: TEXT_DARK,
  },

  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },

  primaryBtn: {
    flex: 1,
    backgroundColor: ACCENT,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },

  statusText: { marginTop: 8, color: '#F57C00', fontWeight: '600' },
});
