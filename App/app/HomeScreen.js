// import { PIURL } from '@env';
// import { useState } from 'react';
// import { Alert, Image, StyleSheet, View } from 'react-native';
// import { Button } from 'react-native-paper';
// import { WebView } from 'react-native-webview';
// import HeaderBar from '../components/headerBar';

// const API_BASE_URL = PIURL;

// export default function HomeScreen() {
//   const [capturedUrl, setCapturedUrl] = useState(null);

//   const handleCapture = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/capture`, { method: 'POST' });
//       const json = await res.json();

//       if (json.success) {
//         Alert.alert('Captured!', 'Image URL: ' + json.url);
//         setCapturedUrl(`${API_BASE_URL}${json.url}`);
//       } else {
//         Alert.alert('Failed', json.error || 'Capture failed');
//       }
//     } catch {
//       Alert.alert('Error', 'Network error');
//     }
//   };

//   return (
//     <>
//       <HeaderBar title="AGROROVER" />
//       <View style={styles.container}>
//         <View style={styles.videoContainer}>
//           <WebView
//             source={{ uri: `${API_BASE_URL}/video` }}
//             style={styles.webview}
//             allowsInlineMediaPlayback
//             mediaPlaybackRequiresUserAction={false}
//           />
//         </View>
//         <Button mode="contained" onPress={handleCapture} style={styles.btn}>
//           Capture & Upload
//         </Button>
//         {capturedUrl && (
//           <Image
//             source={{ uri: capturedUrl }}
//             style={styles.capturedImage}
//             resizeMode="contain"
//           />
//         )}
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#E8F5E9',
//     padding: 16,
//     justifyContent: 'center',
//   },
//   videoContainer: {
//     flex: 1,
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: '#C8E6C9',
//     marginBottom: 20,
//   },
//   webview: { flex: 1 },
//   btn: { alignSelf: 'center', width: 180, marginBottom: 60 },
//   capturedImage: {
//     width: 200,
//     height: 200,
//     alignSelf: 'center',
//     marginTop: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#43a047',
//     backgroundColor: '#fff',
//   },
// });

import { PIURL, SERVER_IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import HeaderBar from '../components/headerBar';

const API_BASE_URL = PIURL; // Flask server (Pi)
const NODE_BASE_URL = SERVER_IP;

export default function HomeScreen() {
  const handleCapture = async () => {
    try {
      // Step 1: Flask capture call
      const res = await fetch(`${API_BASE_URL}/capture`, { method: 'POST' });
      const json = await res.json();

      if (json.success && json.image) {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'User not logged in');
          return;
        }

        // Step 2: Prepare form-data with base64 image
        const formData = new FormData();
        formData.append('file', {
          uri: `data:image/jpeg;base64,${json.image}`,
          type: 'image/jpeg',
          name: `captured_${json.timestamp}.jpg`,
        });

        console.log('Uploading to:', `${NODE_BASE_URL}/api/upload`);

        // // Step 3: Upload to Node
        const uploadRes = await fetch(`${NODE_BASE_URL}/api/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 👇 Debug logs add karo
        console.log('Response status:', uploadRes.status);
        console.log('Response headers:', uploadRes.headers);
        const debugText = await uploadRes.text();
        console.log('Response body:', debugText);

        let uploadJson;
        try {
          uploadJson = JSON.parse(debugText);
        } catch (e) {
          console.log('JSON parse error:', e);
          Alert.alert('Server Error', debugText.substring(0, 200));
          return;
        }

        if (uploadJson.success) {
          Alert.alert('Uploaded!', 'Image stored in database.');
        } else {
          Alert.alert('Upload Failed', uploadJson.error || 'Unknown error');
        }
      } else {
        Alert.alert('Failed', json.error || 'Capture failed');
      }
    } catch (err) {
      console.log('Capture/Upload error:', err);
      Alert.alert('Error', 'Network error');
    }
  };

  return (
    <>
      <HeaderBar title="AGROROVER" />
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          <WebView
            source={{ uri: `${API_BASE_URL}/video` }}
            style={styles.webview}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
          />
        </View>
        <Button mode="contained" onPress={handleCapture} style={styles.btn}>
          Capture & Upload
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    padding: 16,
    justifyContent: 'center',
  },
  videoContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#C8E6C9',
    marginBottom: 20,
  },
  webview: { flex: 1 },
  btn: { alignSelf: 'center', width: 180, marginBottom: 60 },
});
