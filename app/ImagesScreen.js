import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Alert, StyleSheet, Text } from 'react-native';
import { Camera } from 'expo-camera';

export default function ImagesScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      const localUri = photo.uri;

      // Image upload
      const formData = new FormData();
      formData.append('image', {
        uri: localUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      try {
        const response = await fetch('http://192.168.33.71:5000/capture', {
          method: 'POST',
          body: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const data = await response.json();
        if (response.ok) Alert.alert('Success', data.message);
        else Alert.alert('Upload failed');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} />
      <Button title="Capture & Upload" onPress={takePicture} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
});
