import { ScrollView, StyleSheet, Text } from 'react-native';
import HeaderBar from '../components/headerBar';

export default function PrivacyPolicy() {
  return (
    <>
      <HeaderBar title="Privacy Policy" />
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
});
