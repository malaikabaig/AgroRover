// app/LoginScreen.js
import { SERVER_IP } from '@env';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

WebBrowser.maybeCompleteAuthSession();

const NODE_BASE_URL = SERVER_IP;
console.log('NODE_BASE_URL =', NODE_BASE_URL);

export default function LoginScreen({ setIsLoggedIn, navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  //  Include both Expo and Android client IDs
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.GOOGLE_EXPO_CLIENT_ID,
    androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const handleGoogleResponse = async () => {
        try {
          const res = await fetch(`${NODE_BASE_URL}/api/auth/google/callback`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${response.authentication?.accessToken || ''}`,
            },
          });

          const data = await res.json();
          if (res.ok) {
            const user = data.user || {};
            const safeEmail = user.email || '';
            const safeUsername = user.username || '';
            const safeRoverId = user.roverId || '';
            const safeAvatar =
              user.avatarUrl ||
              (safeEmail
                ? `https://i.pravatar.cc/100?u=${encodeURIComponent(safeEmail)}`
                : '');

            await AsyncStorage.multiSet([
              ['token', data.token || ''],
              ['email', safeEmail],
              ['username', safeUsername],
              ['name', safeUsername],
              ['roverId', safeRoverId],
              ['avatarUrl', safeAvatar],
            ]);

            setIsLoggedIn(true);
          } else {
            Alert.alert('Google Login Failed', data.message || 'Try again');
          }
        } catch (err) {
          Alert.alert('Error', 'Network error during Google login');
        }
      };
      handleGoogleResponse();
    }
  }, [response, setIsLoggedIn]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${NODE_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error('Invalid server response');
      }

      if (!res.ok) {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
        return;
      }

      const user = data.user || {};
      const safeEmail = user.email || '';
      const safeUsername = user.username || '';
      const safeRoverId = user.roverId || '';
      const safeAvatar =
        user.avatarUrl ||
        (safeEmail
          ? `https://i.pravatar.cc/100?u=${encodeURIComponent(safeEmail)}`
          : '');

      await AsyncStorage.multiSet([
        ['token', data.token || ''],
        ['email', safeEmail],
        ['username', safeUsername],
        ['name', safeUsername],
        ['roverId', safeRoverId],
        ['avatarUrl', safeAvatar],
      ]);

      setIsLoggedIn(true);
    } catch (err) {
      Alert.alert('Error', 'Network error, try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    promptAsync();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Login to AgroRover</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        disabled={loading}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        disabled={loading}
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Login
      </Button>

      <Button
        onPress={() => navigation.navigate('Signup')}
        style={styles.link}
        disabled={loading}
      >
        Don't have an account? Sign Up
      </Button>

      <View style={styles.divider} />
      <Button
        icon={() => <AntDesign name="google" size={20} color="white" />}
        mode="contained"
        onPress={handleGoogleSignIn}
        style={styles.googleButton}
        labelStyle={{ fontWeight: 'bold' }}
        disabled={loading}
      >
        Sign in with Google
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#E8F5E9',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  input: { marginBottom: 15 },
  button: { marginTop: 10 },
  link: { marginTop: 10, textAlign: 'center' },
  divider: { height: 1, backgroundColor: '#ccc', marginVertical: 24 },
  googleButton: { backgroundColor: '#2E7D32', borderRadius: 6 },
});
