import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import HeaderBar from '../components/headerBar';

export default function VideoSettings() {
  const navigation = useNavigation(); // 👈 navigation hook

  const [isHD, setIsHD] = React.useState(true);
  const [isAudio, setIsAudio] = React.useState(true);

  return (
    <>
      {/* 👇 Back button added just like AboutUs */}
      <HeaderBar title="Video Settings" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <View style={styles.optionRow}>
          <Text style={styles.label}>HD Quality</Text>
          <Switch value={isHD} onValueChange={setIsHD} />
        </View>
        <View style={styles.optionRow}>
          <Text style={styles.label}>Audio Enabled</Text>
          <Switch value={isAudio} onValueChange={setIsAudio} />
        </View>
        {/* Add more video settings here */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
  },
});
