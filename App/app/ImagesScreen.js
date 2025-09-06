// import { SERVER_IP } from '@env';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useCallback, useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Image,
//   RefreshControl,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import { IconButton } from 'react-native-paper';
// import HeaderBar from '../components/headerBar';

// const NODE_BASE_URL = (SERVER_IP || '').replace(/\/+$/, '');

// export default function ImagesScreen() {
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [showDelete, setShowDelete] = useState(null); // Track image for delete button visibility

//   const fetchImages = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         Alert.alert('Login required', 'Please log in first');
//         setLoading(false);
//         return;
//       }

//       const res = await fetch(`${NODE_BASE_URL}/api/my-images`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const text = await res.text();
//       let json;
//       try {
//         json = JSON.parse(text);
//       } catch {
//         throw new Error(text);
//       }

//       if (!json.success) throw new Error(json.error || 'Failed to load images');
//       setImages(Array.isArray(json.images) ? json.images : []);
//     } catch (err) {
//       console.log('Images fetch error:', err);
//       Alert.alert('Error', String(err.message || err));
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchImages();
//   }, [fetchImages]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchImages();
//   };

//   const handleDelete = async (imageId) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         Alert.alert('Login required', 'Please log in first');
//         return;
//       }

//       const res = await fetch(`${NODE_BASE_URL}/api/images/${imageId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const json = await res.json();
//       if (!json.success)
//         throw new Error(json.error || 'Failed to delete image');
//       Alert.alert('Success', 'Image deleted successfully');
//       fetchImages(); // Refresh the images list
//     } catch (err) {
//       console.log('Delete image error:', err);
//       Alert.alert('Error', 'Failed to delete image');
//     }
//   };

//   const renderItem = ({ item }) => {
//     const uri = item?.url?.startsWith('http')
//       ? item.url
//       : `${NODE_BASE_URL}${item?.url?.startsWith('/') ? '' : '/'}${item?.url || ''}`;

//     const created = item.createdAt
//       ? new Date(item.createdAt).toLocaleString()
//       : '';

//     return (
//       <View style={styles.card}>
//         <Image source={{ uri }} style={styles.image} resizeMode="cover" />
//         {!!created && (
//           <View style={styles.meta}>
//             <Text style={styles.time}>{created}</Text>
//             {/* Three dots button */}
//             <IconButton
//               icon="dots-vertical"
//               size={20}
//               onPress={() =>
//                 // Toggle visibility for the clicked image only
//                 setShowDelete(showDelete === item._id ? null : item._id)
//               }
//               style={styles.dotsButton}
//             />
//             {/* Conditional delete button */}
//             {showDelete === item._id && (
//               <IconButton
//                 icon="delete"
//                 size={20}
//                 onPress={() => handleDelete(item._id)}
//                 style={styles.deleteButton}
//               />
//             )}
//           </View>
//         )}
//       </View>
//     );
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <HeaderBar title="My Images" />
//       {loading ? (
//         <ActivityIndicator size="large" style={{ marginTop: 24 }} />
//       ) : (
//         <FlatList
//           data={images}
//           keyExtractor={(it, idx) => it._id || String(idx)}
//           contentContainerStyle={styles.list}
//           renderItem={renderItem}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//           ListEmptyComponent={
//             <Text style={styles.empty}>No images yet. Capture one!</Text>
//           }
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   list: { padding: 12 },
//   card: {
//     marginBottom: 16,
//     backgroundColor: '#f7f7f7',
//     borderRadius: 10,
//     overflow: 'hidden',
//     elevation: 2,
//     position: 'relative',
//   },
//   image: { width: '100%', height: 220, backgroundColor: '#ddd' },
//   meta: {
//     padding: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   time: { color: '#555', flex: 1 },
//   dotsButton: {
//     padding: 0,
//     marginLeft: 10,
//   },
//   deleteButton: {
//     padding: 0,
//     marginLeft: 10,
//     color: 'red',
//   },
//   empty: { textAlign: 'center', marginTop: 32, color: '#666' },
// });

import { SERVER_IP } from '@env';
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
  View,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import HeaderBar from '../components/headerBar';

const NODE_BASE_URL = (SERVER_IP || '').replace(/\/+$/, '');

export default function ImagesScreen() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDelete, setShowDelete] = useState(null); // Track image for delete button visibility

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Login required', 'Please log in first');
        setLoading(false);
        return;
      }

      const res = await fetch(`${NODE_BASE_URL}/api/my-images`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text();
      console.log('Raw response text:', text);

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(text);
      }

      console.log('Parsed JSON response:', json);

      if (!json.success) throw new Error(json.error || 'Failed to load images');
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

  const handleDelete = async (image) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Login required', 'Please log in first');
        return;
      }

      const res = await fetch(`${NODE_BASE_URL}/api/images/${image._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: image.public_id || null, // 👈 Cloudinary ke liye zaroori
        }),
      });

      const json = await res.json();
      console.log('Delete response JSON:', json);

      if (!json.success)
        throw new Error(json.error || 'Failed to delete image');

      Alert.alert('Success', 'Image deleted successfully');
      fetchImages();
    } catch (err) {
      console.log('Delete image error:', err);
      Alert.alert('Error', String(err.message || err));
    }
  };

  const renderItem = ({ item }) => {
    const uri = item?.url?.startsWith('http')
      ? item.url
      : `${NODE_BASE_URL}${item?.url?.startsWith('/') ? '' : '/'}${item?.url || ''}`;

    const created = item.createdAt
      ? new Date(item.createdAt).toLocaleString()
      : '';

    return (
      <View style={styles.card}>
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
        {!!created && (
          <View style={styles.meta}>
            <Text style={styles.time}>{created}</Text>
            {/* Three dots button */}
            <IconButton
              icon="dots-vertical"
              size={20}
              onPress={() =>
                // Toggle visibility for the clicked image only
                setShowDelete(showDelete === item._id ? null : item._id)
              }
              style={styles.dotsButton}
            />
            {/* Conditional delete button */}
            {showDelete === item._id && (
              <IconButton
                icon="delete"
                size={20}
                iconColor="purple"
                onPress={() => handleDelete(item._id)}
                style={styles.deleteButton}
              />
            )}
          </View>
        )}
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
    position: 'relative',
  },
  image: { width: '100%', height: 220, backgroundColor: '#ddd' },
  meta: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: { color: '#555', flex: 1 },
  dotsButton: {
    padding: 0,
    marginLeft: 10,
  },
  deleteButton: {
    padding: 0,
    marginLeft: 10,
  },
  empty: { textAlign: 'center', marginTop: 32, color: '#666' },
});
