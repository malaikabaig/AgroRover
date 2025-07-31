import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text } from 'react-native';
import HeaderBar from '../components/headerBar';

export default function AboutUs() {
  const navigation = useNavigation(); // <-- use navigation hook

  return (
    <>
      {/* Passing onBack to HeaderBar */}
      <HeaderBar title="About AgroRover" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>
          AgroRover is an AI-based automated farming rover project built using
          React Native and Expo.
          {'\n\n'}Our mission is to make farming smarter, easier, and more
          efficient through technology.
          {'\n\n'}For more info, visit www.agrorover.com or contact us.
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
