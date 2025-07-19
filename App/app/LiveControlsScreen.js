import { useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import HeaderBar from '../components/headerBar';
import Joystick from '../components/Joystick';

const SERVER = 'http://192.168.238.1:5000';
const { width, height } = Dimensions.get('window');

export default function LiveControlsScreen() {
  const [bannerMsg, setBannerMsg] = useState('');
  const bannerOpacity = useState(new Animated.Value(0))[0];

  const showBanner = (msg) => {
    setBannerMsg(msg);
    Animated.timing(bannerOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(bannerOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }, 2000);
    });
  };

  const handleDirection = ({ x, y }) => {
    let direction = 'stop';
    if (Math.abs(x) > 0.3 || Math.abs(y) > 0.3) {
      if (y < -0.5) direction = 'backward';
      else if (y > 0.5) direction = 'forward';
      else if (x < -0.5) direction = 'left';
      else if (x > 0.5) direction = 'right';
    }
    const endpoint = direction === 'stop' ? '/stop' : '/move';
    const body = direction === 'stop' ? {} : { direction };
    fetch(`${SERVER}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((res) => res.json().then((json) => ({ ok: res.ok, json })))
      .then(({ ok }) => {
        if (!ok) showBanner('Server not reachable.');
      })
      .catch(() => {
        showBanner('Network error, try again.');
      });
  };

  const handleArm = (motor, direction) => {
    fetch(`${SERVER}/arm-control`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ motor, direction }),
    })
      .then((res) => res.json().then((json) => ({ ok: res.ok, json })))
      .then(({ ok }) => {
        if (!ok) showBanner('Arm control failed.');
      })
      .catch(() => {
        showBanner('Network error, try again.');
      });
  };

  return (
    <View style={styles.container}>
      <HeaderBar title="Live Controls" />
      {bannerMsg !== '' && (
        <Animated.View style={[styles.banner, { opacity: bannerOpacity }]}>
          <Text style={styles.bannerText}>{bannerMsg}</Text>
        </Animated.View>
      )}
      <View style={styles.videoContainer}>
        <WebView
          source={{ uri: `${SERVER}/video` }}
          style={StyleSheet.absoluteFillObject}
          onError={() => showBanner('Video not available')}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
        />
      </View>
      <View style={styles.controlsContainer} pointerEvents="box-none">
        <View style={styles.joyArea} pointerEvents="box-none">
          <Joystick size={120} knobSize={60} onDirection={handleDirection} />
        </View>
        <View style={styles.armArea} pointerEvents="box-none">
          <Text style={styles.sectionTitle}>Arm Controls</Text>
          {[1, 2, 3].map((motor) => (
            <View key={motor} style={styles.armRow}>
              <Text style={styles.motorLabel}>M{motor}</Text>
              <TouchableOpacity
                style={styles.armBtn}
                onPress={() => handleArm(motor, 'left')}
              >
                <Text style={styles.btnText}>↺</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.armBtn}
                onPress={() => handleArm(motor, 'right')}
              >
                <Text style={styles.btnText}>↻</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F5E9' },
  banner: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: '#D32F2F',
    padding: 8,
    alignItems: 'center',
    zIndex: 5,
  },
  bannerText: { color: '#fff', fontSize: 14 },
  videoContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#C8E6C9',
  },
  controlsContainer: { ...StyleSheet.absoluteFillObject, zIndex: 2 },
  joyArea: { position: 'absolute', bottom: 40, left: 20, zIndex: 3 },
  armArea: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 10,
    zIndex: 3,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1b5e20',
    textAlign: 'center',
  },
  armRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'space-around',
  },
  motorLabel: {
    fontSize: 12,
    color: '#1b5e20',
    width: 40,
    textAlign: 'center',
  },
  armBtn: {
    backgroundColor: '#43a047',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
