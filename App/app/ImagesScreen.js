import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';

import HeaderBar from '../components/headerBar';

const API_BASE_URL = 'http://10.13.68.178:5000'; // Apna backend IP yahan daalein

export default function ImagesScreen() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/images`);
        const data = await res.json();
        if (res.ok) {
          setImages(data.images || []);
        } else {
          Alert.alert('Error', data.message || 'Failed to load images');
        }
      } catch (error) {
        Alert.alert('Error', 'Network error fetching images');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const handleSendToModel = async (imageUrl) => {
    // Aapka API ya logic jahan ye image send karni hai
    Alert.alert('Info', 'Sent image to model: ' + imageUrl);
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderBar title="Images" />

      {loading ? (
        <ActivityIndicator size="large" style={styles.loading} />
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={styles.container}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.url }} style={styles.image} />
              <Button
                mode="contained"
                onPress={() => handleSendToModel(item.url)}
              >
                Send to Model
              </Button>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { marginTop: 20 },
  container: { padding: 10 },
  card: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    padding: 10,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
  },
});
