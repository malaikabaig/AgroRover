import { Alert, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import HeaderBar from '../components/headerBar';

export default function HomeScreen() {
  return (
    <>
      <HeaderBar title="AGROROVER" />
      <View style={styles.container}>
        <Card style={styles.videoFeed}>
          <Text
            style={{
              textAlign: 'center',
              marginVertical: 20,
              fontSize: 18,
              color: '#444',
            }}
          >
            [Live Video Feed Placeholder]
          </Text>
        </Card>
        <Button
          mode="contained"
          style={styles.captureButton}
          onPress={() => Alert.alert('Image Captured')}
        >
          Capture
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
  },
  videoFeed: {
    height: 300,
    borderRadius: 8,
    backgroundColor: '#C8E6C9',
    marginBottom: 20,
  },
  captureButton: { alignSelf: 'center', width: 150 },
});
