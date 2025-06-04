// // import { StyleSheet, View, Alert } from 'react-native';
// // import { Card, Button } from 'react-native-paper';
// // import { WebView } from 'react-native-webview';
// // import HeaderBar from '../components/headerBar';

// // export default function HomeScreen() {
// //   return (
// //     <>
// //       <HeaderBar title="AGROROVER" />
// //       <View style={styles.container}>
// //         <Card style={styles.videoFeed}>
// //           <WebView
// //             source={{
// //               uri: 'https://0ab7-2404-3100-1cap-5623-1c1a-9b60-6a55-3aca.ngrok-free.app/video',
// //             }}
// //             style={styles.webview}
// //           />
// //         </Card>
// //         <Button
// //           mode="contained"
// //           style={styles.captureButton}
// //           onPress={() => Alert.alert('Image Captured')}
// //         >
// //           Capture
// //         </Button>
// //       </View>
// //     </>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 16,
// //     backgroundColor: '#E8F5E9',
// //     justifyContent: 'center',
// //   },
// //   videoFeed: {
// //     height: 300,
// //     borderRadius: 8,
// //     backgroundColor: '#C8E6C9',
// //     marginBottom: 20,
// //     overflow: 'hidden',
// //   },
// //   webview: {
// //     flex: 1,
// //   },
// // });

// import React, { useEffect, useState } from 'react';
// import { StyleSheet, View, Alert, Image } from 'react-native';
// import { Button, Card } from 'react-native-paper';
// import HeaderBar from '../components/headerBar';

// export default function HomeScreen() {
//   const [timestamp, setTimestamp] = useState(Date.now());

//   // Auto-refresh image stream
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimestamp(Date.now());
//     }, 50); // refresh every 300ms
//     return () => clearInterval(interval);
//   }, []);

//   const handleCapture = async () => {
//     try {
//       const res = await fetch(
//         ' https://1a10-154-192-134-12.ngrok-free.app/capture',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       const json = await res.json();
//       if (json.success) {
//         Alert.alert('Image Captured');
//       } else {
//         Alert.alert('Capture Failed');
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Failed to reach server');
//     }
//   };

//   return (
//     <>
//       <HeaderBar title="AGROROVER" />
//       <View style={styles.container}>
//         <Card style={styles.videoFeed}>
//           <Image
//             source={{
//               uri: ` https://1a10-154-192-134-12.ngrok-free.app/video?${timestamp}`,
//             }}
//             style={styles.image}
//             resizeMode="cover"
//           />
//         </Card>
//         <Button
//           mode="contained"
//           style={styles.captureButton}
//           onPress={handleCapture}
//         >
//           Capture
//         </Button>
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#E8F5E9',
//     justifyContent: 'center',
//   },
//   videoFeed: {
//     height: 300,
//     borderRadius: 8,
//     backgroundColor: '#C8E6C9',
//     marginBottom: 20,
//     overflow: 'hidden',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
//   captureButton: {
//     alignSelf: 'center',
//     width: 150,
//   },
// });

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import HeaderBar from '../components/headerBar';
import { WebView } from 'react-native-webview';

export default function HomeScreen() {
  const handleCapture = async () => {
    try {
      const res = await fetch(
        'https://3f5e-154-192-134-12.ngrok-free.app/capture',
        {
          method: 'POST',
        }
      );
      const json = await res.json();
      if (json.success) {
        alert('Image Captured');
      } else {
        alert('Capture Failed');
      }
    } catch (err) {
      alert('Server unreachable');
    }
  };

  return (
    <>
      <HeaderBar title="AGROROVER" />
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          <WebView
            source={{ uri: 'https://3f5e-154-192-134-12.ngrok-free.app/video' }}
            style={styles.webview}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
          />
        </View>
        <Button
          mode="contained"
          onPress={handleCapture}
          style={styles.captureButton}
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
    backgroundColor: '#E8F5E9',
    padding: 16,
    justifyContent: 'center',
  },
  videoContainer: {
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#C8E6C9',
    marginBottom: 20,
  },
  webview: {
    flex: 1,
  },
  captureButton: {
    width: 150,
    alignSelf: 'center',
  },
});
