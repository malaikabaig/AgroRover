import { useNavigation } from '@react-navigation/native'; // <-- useNavigation hook import
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import HeaderBar from '../components/headerBar'; // <-- import HeaderBar

export default function PrivacyPolicy() {
  const navigation = useNavigation(); // <-- initialize navigation hook

  return (
    <View style={styles.screen}>
      {/* Passing the onBack function to HeaderBar */}
      <HeaderBar title="Privacy Policy" onBack={() => navigation.goBack()} />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>
          This is the Privacy Policy of AgroRover. We respect your privacy and
          are committed to protecting your personal information.
          {'\n\n'}We collect data to improve the performance and user experience
          of the app. Your data will not be shared with third parties without
          your consent.
          {'\n\n'}For more information, contact support@agrorover.com.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
});
