import { ScrollView, StyleSheet, Text } from 'react-native';
import HeaderBar from '../components/headerBar';

export default function TermsServices() {
  return (
    <>
      <HeaderBar title="Terms & Services" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>
          These are the Terms and Services for using AgroRover.
          {'\n\n'}By using this app, you agree to comply with all applicable
          laws and regulations.
          {'\n\n'}We reserve the right to modify these terms at any time.
          {'\n\n'}For questions, please contact support@agrorover.com.
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
