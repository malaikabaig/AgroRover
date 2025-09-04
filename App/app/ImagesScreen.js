import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderBar from '../components/headerBar';

const NODE_BASE_URL = 'http://10.0.2.2:5001'; // laptop from Android emulator

export default function ImagesScreen() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Login required', 'Please log in first');
        setLoading(false);
        return;
      }

      // 👉 If you want all images (admin view), hit /api/images
      // For per-user images, hit /api/my-images
      const res = await fetch(`${NODE_BASE_URL}/api/my-images`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (_) {
        throw new Error(text.slice(0, 200));
      }

      if (!json.success) {
        throw new Error(json.error || 'Failed to load images');
      }

      setImages(Array.isArray(json.images) ? json.images : []);
    } catch (err) {
      console.log('Images fetch error:', err);
      Alert.alert('Error', String(err.message || err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchImages();
  };

  const renderItem = ({ item }) => {
    // item.url is like "/uploads/filename.jpg" -> make absolute:
    const uri = `${NODE_BASE_URL}${item.url}`;
    const created = item.createdAt
      ? new Date(item.createdAt).toLocaleString()
      : '';

    return (
      <View style={styles.card}>
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
        <View style={styles.row}>
          <Text style={styles.time}>{created}</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => Alert.alert('Info', `Send to model:\n${uri}`)}
          >
            <Text style={styles.btnText}>Send to Model</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderBar title="My Images" />
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={images}
          keyExtractor={(it, idx) => it._id || String(idx)}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No images yet. Capture one!</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 12 },
  card: {
    marginBottom: 16,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { width: '100%', height: 220, backgroundColor: '#ddd' },
  row: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: { color: '#555' },
  btn: {
    backgroundColor: '#4a148c',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 32, color: '#666' },
});
