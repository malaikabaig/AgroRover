import { SERVER_IP } from '@env';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';
import HeaderBar from '../components/headerBar'; // Ensure HeaderBar is imported

const API_URL = `http://${SERVER_IP}:5000`;

export default function ProfileScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [imagePicked, setImagePicked] = useState(false); // To check if image is picked

  const pickImage = async () => {
    // Request media library permissions
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    // Launch the image picker with updated options
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images, // Updated to use MediaType
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    // Check if the user picked an image
    if (!result.cancelled) {
      setImage(result.uri); // Set the image URI
      setImagePicked(true); // Image is picked
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert('Error', 'Please pick an image before submitting');
      return;
    }

    // Submit the image to the server
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'profile_image.jpg',
      });

      const res = await fetch(`${API_BASE_URL}/api/profile/image`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Profile image updated successfully');
        // Optionally, reset the form or update state
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error, please try again');
    }
  };

  return (
    <>
      {/* Pass onBack to HeaderBar */}
      <HeaderBar title="Profile" onBack={() => navigation.goBack()} />{' '}
      {/* Make sure you pass navigation here */}
      {/* Profile Image Section */}
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Profile Image</Text>

        {/* Displaying Image if available */}
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.noImageText}>No profile image selected</Text>
        )}

        {/* Button to upload or change the image */}
        <Button
          title={imagePicked ? 'Submit' : 'Upload Image'}
          onPress={imagePicked ? handleSubmit : pickImage}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  noImageText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#999',
  },
});
