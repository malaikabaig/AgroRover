//

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function LiveControlsScreen() {
  const sendMoveCommand = async (direction) => {
    try {
      const response = await fetch('http://YOUR_BACKEND_IP:PORT/rover/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      });
      const data = await response.json();
      if (response.ok) Alert.alert('Success', data.message);
      else Alert.alert('Error', data.error || 'Something went wrong');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>AgroRover</Text>
      <Text style={styles.subHeader}>Live Controls</Text>

      <View style={styles.joystickContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => sendMoveCommand('forward')}
        >
          <Text style={styles.buttonText}>↑</Text>
        </TouchableOpacity>

        <View style={styles.middleRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => sendMoveCommand('left')}
          >
            <Text style={styles.buttonText}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => sendMoveCommand('stop')}
          >
            <Text style={styles.buttonText}>■</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => sendMoveCommand('right')}
          >
            <Text style={styles.buttonText}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => sendMoveCommand('backward')}
        >
          <Text style={styles.buttonText}>↓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  header: { fontSize: 28, fontWeight: 'bold', marginTop: 30 },
  subHeader: { fontSize: 20, color: '#666', marginVertical: 20 },
  joystickContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  buttonText: { fontSize: 24, color: 'white', fontWeight: 'bold' },
});
