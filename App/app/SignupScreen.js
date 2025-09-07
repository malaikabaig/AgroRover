import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { SERVER_IP } from './config';

const NODE_BASE_URL = SERVER_IP;

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const hasUpper = /[A-Z]/;
const hasDigit = /\d/;
const hasSpecial = /[^A-Za-z0-9]/;

export default function SignupScreen({ navigation, setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
  });

  const emailValid = useMemo(() => emailRegex.test(email), [email]);

  // password strength text (same logic you had)
  const strength = useMemo(() => {
    if (!password) return 'none';
    if (/^[a-z]+$/.test(password)) return 'weak';
    if (/[A-Za-z]/.test(password) && hasDigit.test(password)) {
      if (hasUpper.test(password) && hasSpecial.test(password)) return 'strong';
      return 'moderate';
    }
    return 'weak';
  }, [password]);

  const canSubmit =
    username.trim().length >= 3 &&
    username.trim().length <= 10 &&
    emailValid &&
    password.length >= 1;

  const handleSignup = async () => {
    if (!canSubmit) {
      Alert.alert(
        'Fix details',
        'Please complete username/email/password correctly.'
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${NODE_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await res.json();

      if (res.ok) {
        await AsyncStorage.multiSet([
          ['token', data.token || ''],
          ['email', data.user?.email || ''],
          ['username', data.user?.username || ''],
          ['name', data.user?.username || ''],
          ['roverId', data.user?.roverId || ''],
          ['avatarUrl', data.user?.avatarUrl || ''],
        ]);
        setIsLoggedIn(true);
      } else {
        Alert.alert(
          'Signup Failed',
          data.message || 'Unable to create account'
        );
      }
    } catch (err) {
      Alert.alert('Cannot Sign Up', 'Network error, try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Create AgroRover Account</Text>

      {/* Username */}
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
        disabled={loading}
        onBlur={() => setTouched((t) => ({ ...t, username: true }))}
      />
      <HelperText
        type={
          !username
            ? 'info'
            : username.trim().length < 3 || username.trim().length > 10
              ? 'error'
              : 'info'
        }
        visible={touched.username}
      >
        {!username
          ? '3–10 chars, no spaces'
          : username.trim().length < 3
            ? 'Too short (min 3)'
            : username.trim().length > 10
              ? 'Too long (max 10)'
              : 'Looks good ✅'}
      </HelperText>

      {/* Email */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        disabled={loading}
        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        error={touched.email && !emailValid}
      />
      <HelperText type={emailValid ? 'info' : 'error'} visible={touched.email}>
        {emailValid ? 'Looks good ✅' : 'Please enter a valid email'}
      </HelperText>

      {/* Password */}
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        disabled={loading}
        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
      />
      {password ? (
        <Text
          style={{
            color:
              strength === 'weak'
                ? '#e53935'
                : strength === 'moderate'
                  ? '#fb8c00'
                  : '#2E7D32',
            marginTop: -8,
            marginBottom: 8,
          }}
        >
          {strength === 'weak'
            ? 'Weak — only lowercase letters'
            : strength === 'moderate'
              ? 'Moderate — letters + numbers'
              : 'Strong — includes UPPER + numbers + special'}
        </Text>
      ) : (
        <HelperText type="info" visible>
          Use uppercase + numbers + special char.
        </HelperText>
      )}

      <Button
        mode="contained"
        onPress={handleSignup}
        style={styles.button}
        loading={loading}
        disabled={loading || !canSubmit}
      >
        Sign Up
      </Button>

      <Button
        onPress={() => navigation.goBack()}
        style={styles.link}
        disabled={loading}
      >
        Already have an account? Login
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
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  input: { marginBottom: 8 },
  button: { marginTop: 10 },
  link: { marginTop: 10, textAlign: 'center' },
});
