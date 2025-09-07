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
//   const [showDelete, setShowDelete] = useState(null); // which card's menu is open

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

//   // ✅ Only needs the id; backend uses DB-stored public_id
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
//       setShowDelete(null); // hide menu
//       fetchImages(); // refresh list
//     } catch (err) {
//       console.log('Delete image error:', err);
//       Alert.alert('Error', String(err.message || err));
//     }
//   };

//   const confirmDelete = (imageId) => {
//     Alert.alert('Delete image?', 'This cannot be undone.', [
//       { text: 'Cancel', style: 'cancel', onPress: () => setShowDelete(null) },
//       {
//         text: 'Delete',
//         style: 'destructive',
//         onPress: () => handleDelete(imageId),
//       },
//     ]);
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

//             {/* three-dots toggler */}
//             <IconButton
//               icon="dots-vertical"
//               size={20}
//               onPress={() =>
//                 setShowDelete(showDelete === item._id ? null : item._id)
//               }
//               style={styles.dotsButton}
//             />

//             {/* conditional delete action */}
//             {showDelete === item._id && (
//               <IconButton
//                 icon="delete"
//                 size={20}
//                 iconColor="purple"
//                 onPress={() => confirmDelete(item._id)}
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
//   dotsButton: { padding: 0, marginLeft: 10 },
//   deleteButton: { padding: 0, marginLeft: 10 },
//   empty: { textAlign: 'center', marginTop: 32, color: '#666' },
// });
// app/ImagesScreen.js
import { SERVER_IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
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
  const [showDelete, setShowDelete] = useState(null); // which card's menu is open
  const [analyzingId, setAnalyzingId] = useState(null); // track which image is being analyzed

  // preview modal state
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  // response modal (image with overlays)
  const [responseVisible, setResponseVisible] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);
  const [responseItem, setResponseItem] = useState(null); // full item (id + url)
  const [detections, setDetections] = useState([]); // normalized detections

  // image sizing (natural & displayed) for overlay scaling
  const [natSize, setNatSize] = useState({ w: 0, h: 0 });
  const [dispW, setDispW] = useState(0); // container computed width
  const dispH = natSize.w > 0 ? (dispW * natSize.h) / natSize.w : 0;

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
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(text);
      }

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

  // ✅ delete needs only the _id
  const handleDelete = async (imageId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Login required', 'Please log in first');
        return;
      }

      const res = await fetch(`${NODE_BASE_URL}/api/images/${imageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!json.success)
        throw new Error(json.error || 'Failed to delete image');

      Alert.alert('Success', 'Image deleted successfully');
      setShowDelete(null);
      if (previewItem?._id === imageId) {
        setPreviewVisible(false);
        setPreviewItem(null);
      }
      setResponseVisible(false);
      setResponseItem(null);
      fetchImages();
    } catch (err) {
      console.log('Delete image error:', err);
      Alert.alert('Error', String(err.message || err));
    }
  };

  const confirmDelete = (imageId) => {
    Alert.alert('Delete image?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel', onPress: () => setShowDelete(null) },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => handleDelete(imageId),
      },
    ]);
  };

  // 🔎 Send to model (analyze) — calls /api/images/:id/analyze THEN tries to save via POST /analysis
  const analyzeImage = async (imageId) => {
    try {
      setAnalyzingId(imageId);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Login required', 'Please log in first');
        return;
      }

      // 1) Analyze
      const res = await fetch(
        `${NODE_BASE_URL}/api/images/${imageId}/analyze`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(text);
      }

      if (!json.success) throw new Error(json.error || 'Analysis failed');

      const dets = Array.isArray(json.detections) ? json.detections : [];
      const count = dets.length;
      setShowDelete(null);

      // 2) Try saving the response for later review (if backend route exists)
      try {
        await fetch(`${NODE_BASE_URL}/api/images/${imageId}/analysis`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ detections: dets }),
        });
      } catch (e) {
        // swallow save error to not block UX; user can still see Alert
        console.log('Save analysis error (non-blocking):', e);
      }

      Alert.alert(
        'Analysis Complete',
        count === 0
          ? 'No findings were detected in this image.'
          : `${count} finding(s) detected and saved for review.`
      );
    } catch (err) {
      console.log('Analyze image error:', err);
      Alert.alert('Error', String(err.message || err));
    } finally {
      setAnalyzingId(null);
    }
  };

  const openPreview = (item) => {
    setPreviewItem(item);
    setPreviewVisible(true);
  };

  const closePreview = () => {
    setPreviewVisible(false);
    setPreviewItem(null);
  };

  // 📄 open saved response AS IMAGE WITH OVERLAYS
  const openResponse = async (item) => {
    try {
      setResponseItem(item);
      setResponseVisible(true);
      setResponseLoading(true);

      // natural size for accurate scaling
      const imgUrl = item.url?.startsWith('http')
        ? item.url
        : `${NODE_BASE_URL}${item.url?.startsWith('/') ? '' : '/'}${item.url || ''}`;

      Image.getSize(
        imgUrl,
        (w, h) => setNatSize({ w, h }),
        () => setNatSize({ w: 0, h: 0 })
      );

      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Login required');

      const res = await fetch(
        `${NODE_BASE_URL}/api/images/${item._id}/analysis`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(text);
      }

      if (!json.success) {
        setDetections([]);
        return;
      }
      setDetections(
        Array.isArray(json.analysis?.detections) ? json.analysis.detections : []
      );
    } catch (e) {
      console.log('Load analysis error:', e);
      setDetections([]);
    } finally {
      setResponseLoading(false);
    }
  };

  const closeResponse = () => {
    setResponseVisible(false);
    setResponseItem(null);
    setDetections([]);
    setNatSize({ w: 0, h: 0 });
  };

  // ---------- Overlay rendering helpers ----------
  const renderBoxes = () => {
    if (!detections?.length || !natSize.w || !natSize.h || !dispW || !dispH)
      return null;

    const sx = dispW / natSize.w;
    const sy = dispH / natSize.h;

    return detections.map((d, idx) => {
      // Roboflow: center (x,y) + w,h in px
      const left = (d.x - d.w / 2) * sx;
      const top = (d.y - d.h / 2) * sy;
      const w = d.w * sx;
      const h = d.h * sy;

      return (
        <View
          key={d.id || idx}
          style={[styles.box, { left, top, width: w, height: h }]}
        >
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {d.label} — {(d.conf * 100).toFixed(1)}%
            </Text>
          </View>
        </View>
      );
    });
  };

  const renderItem = ({ item }) => {
    const uri = item?.url?.startsWith('http')
      ? item.url
      : `${NODE_BASE_URL}${item?.url?.startsWith('/') ? '' : '/'}${item?.url || ''}`;

    const created = item.createdAt
      ? new Date(item.createdAt).toLocaleString()
      : '';

    const isAnalyzing = analyzingId === item._id;

    return (
      <View style={styles.card}>
        <Pressable onPress={() => openPreview(item)}>
          <Image source={{ uri }} style={styles.image} resizeMode="cover" />
        </Pressable>

        {!!created && (
          <View style={styles.meta}>
            <Text style={styles.time}>{created}</Text>

            {/* three-dots toggler */}
            <IconButton
              icon="dots-vertical"
              size={20}
              onPress={() =>
                setShowDelete(showDelete === item._id ? null : item._id)
              }
              style={styles.dotsButton}
            />

            {/* actions drawer: Send, Response, Delete */}
            {showDelete === item._id && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconButton
                  icon="send"
                  size={20}
                  disabled={isAnalyzing}
                  onPress={() => analyzeImage(item._id)}
                  style={styles.actionButton}
                />
                <IconButton
                  icon="file-eye"
                  size={20}
                  onPress={() => openResponse(item)}
                  style={styles.actionButton}
                />
                <IconButton
                  icon="delete"
                  size={20}
                  iconColor="purple"
                  onPress={() => confirmDelete(item._id)}
                  style={styles.deleteButton}
                />
              </View>
            )}
          </View>
        )}

        {isAnalyzing && (
          <View style={styles.analyzingOverlay}>
            <ActivityIndicator size="small" />
            <Text style={styles.analyzingText}>Sending to model…</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderBar title="My Images" />

      {/* Formal instruction banner */}
      <Text style={styles.infoText}>
        These are your images. Select any to send to the model for analytics and
        predictions.
      </Text>

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

      {/* Full-screen Preview Modal */}
      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        onRequestClose={closePreview}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            {/* top bar with close (X) */}
            <View style={styles.modalTopBar}>
              <View style={{ flex: 1 }} />
              <IconButton
                icon="close"
                size={24}
                onPress={closePreview}
                style={{ marginRight: -8 }}
                accessibilityLabel="Close preview"
              />
            </View>

            {/* image area */}
            <View style={styles.modalImageWrap}>
              {previewItem && (
                <Image
                  source={{
                    uri: previewItem.url?.startsWith('http')
                      ? previewItem.url
                      : `${NODE_BASE_URL}${previewItem.url?.startsWith('/') ? '' : '/'}${previewItem.url || ''}`,
                  }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              )}
            </View>

            {/* bottom action bar */}
            <View style={styles.modalBottomBar}>
              <IconButton
                icon="send"
                size={24}
                disabled={!previewItem || analyzingId === previewItem?._id}
                onPress={() => analyzeImage(previewItem._id)}
                style={{ marginRight: 6 }}
              />
              {analyzingId === previewItem?._id && (
                <View style={styles.modalAnalyzing}>
                  <ActivityIndicator size="small" />
                  <Text style={styles.modalAnalyzingText}>
                    Sending to model…
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Response Modal: IMAGE + OVERLAYS */}
      <Modal
        visible={responseVisible}
        transparent
        animationType="fade"
        onRequestClose={closeResponse}
      >
        <View style={styles.resBackdrop}>
          <View style={styles.resCard}>
            <View style={styles.resHeader}>
              <Text style={styles.resTitle}>Analysis Response</Text>
              <IconButton icon="close" size={22} onPress={closeResponse} />
            </View>

            {responseLoading ? (
              <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <ActivityIndicator />
                <Text style={{ marginTop: 8, color: '#555' }}>Loading…</Text>
              </View>
            ) : !responseItem ? (
              <Text style={{ color: '#444', paddingVertical: 12 }}>
                No response yet.
              </Text>
            ) : (
              <View
                style={styles.overlayContainer}
                onLayout={(e) => setDispW(e.nativeEvent.layout.width)}
              >
                {/* Fixed-size box based on natural aspect ratio */}
                {!!dispW && !!natSize.w && !!natSize.h && (
                  <View style={{ width: dispW, height: dispH }}>
                    <Image
                      source={{
                        uri: responseItem.url?.startsWith('http')
                          ? responseItem.url
                          : `${NODE_BASE_URL}${responseItem.url?.startsWith('/') ? '' : '/'}${responseItem.url || ''}`,
                      }}
                      style={StyleSheet.absoluteFillObject}
                      resizeMode="contain"
                    />
                    {/* overlays */}
                    <View style={StyleSheet.absoluteFill}>{renderBoxes()}</View>
                  </View>
                )}
              </View>
            )}

            {/* Delete image shortcut (optional) */}
            {!!responseItem && (
              <View style={styles.resFooter}>
                <IconButton
                  icon="delete"
                  size={22}
                  onPress={() => confirmDelete(responseItem._id)}
                />
                <Text style={{ fontSize: 12.5, color: '#666' }}>
                  Tip: Use delete to remove this image entirely.
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 12, paddingTop: 6 },
  infoText: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    color: '#333',
    fontSize: 13.5,
  },
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
  dotsButton: { padding: 0, marginLeft: 10 },
  actionButton: { padding: 0, marginLeft: 4 },
  deleteButton: { padding: 0, marginLeft: 8 },
  analyzingOverlay: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  analyzingText: { marginLeft: 6, color: '#333', fontSize: 12 },
  empty: { textAlign: 'center', marginTop: 32, color: '#666' },

  // preview modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '92%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalTopBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e6e6e6',
  },
  modalImageWrap: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: { width: '100%', height: '100%' },
  modalBottomBar: {
    height: 52,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e6e6e6',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fafafa',
  },
  modalAnalyzing: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  modalAnalyzingText: { marginLeft: 8, fontSize: 13, color: '#333' },

  // response modal styles
  resBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resCard: {
    width: '92%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  resHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  resTitle: { fontSize: 16, fontWeight: '700', color: '#222' },
  resFooter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // overlay area
  overlayContainer: {
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#7C4DFF', // purple-ish like demo
  },
  chip: {
    position: 'absolute',
    left: -2,
    top: -26,
    backgroundColor: 'rgba(124,77,255,0.95)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  chipText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
