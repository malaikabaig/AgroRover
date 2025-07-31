import { PI_STREAM_IP } from '@env';
import { Alert, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import HeaderBar from '../components/headerBar';

const API_BASE_URL = `http://${PI_STREAM_IP}:5000`;

export default function HomeScreen() {
  const handleCapture = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/capture`, { method: 'POST' });
      const json = await res.json();

      if (json.success) {
        Alert.alert('Captured!', 'Image URL: ' + json.url);
      } else {
        Alert.alert('Failed', json.error || 'Capture failed');
      }
    } catch {
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
  btn: { alignSelf: 'center', width: 180 },
});
