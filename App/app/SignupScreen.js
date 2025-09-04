// // SignupScreen.js
// import { SERVER_IP } from '@env';
// import { AntDesign } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useState } from 'react';
// import {
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   View,
// } from 'react-native';
// import { Button, Text, TextInput } from 'react-native-paper';

// const NODE_BASE_URL = `http://${SERVER_IP}:5001`;

// export default function SignupScreen({ navigation, setIsLoggedIn }) {
//   const [email, setEmail] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSignup = async () => {
//     if (!email || !password || !username) {
//       Alert.alert('Error', 'Please fill email, username and password');
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(`${NODE_BASE_URL}/api/auth/signup`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password, username }),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         await AsyncStorage.multiSet([
//           ['token', data.token],
//           ['email', data.user?.email || ''],
//           ['username', data.user?.username || ''],
//           ['name', data.user?.username || ''], // drawer uses this
//           ['roverId', data.user?.roverId || ''],
//           ['avatarUrl', data.user?.avatarUrl || ''],
//         ]);
//         setIsLoggedIn(true);
//         navigation.navigate('MainApp');
//       } else {
//         Alert.alert(
//           'Signup Failed',
//           data.message || 'Unable to create account'
//         );
//       }
//     } catch (err) {
//       Alert.alert('Cannot Sign Up', 'Network error, try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignIn = () => {
//     Alert.alert('Google Sign Up', 'This will be added soon!');
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={styles.container}
//     >
//       <Text style={styles.title}>Create AgroRover Account</Text>

//       <TextInput
//         label="Email"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//         keyboardType="email-address"
//         style={styles.input}
//         disabled={loading}
//       />

//       <TextInput
//         label="Username"
//         value={username}
//         onChangeText={setUsername}
//         autoCapitalize="none"
//         style={styles.input}
//         disabled={loading}
//       />

//       <TextInput
//         label="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         style={styles.input}
//         disabled={loading}
//       />

//       <Button
//         mode="contained"
//         onPress={handleSignup}
//         style={styles.button}
//         loading={loading}
//         disabled={loading}
//       >
//         Sign Up
//       </Button>

//       <Button
//         onPress={() => navigation.goBack()}
//         style={styles.link}
//         disabled={loading}
//       >
//         Already have an account? Login
//       </Button>

//       <View style={styles.divider} />
//       <Button
//         icon={() => <AntDesign name="google" size={20} color="white" />}
//         mode="contained"
//         onPress={handleGoogleSignIn}
//         style={styles.googleButton}
//         labelStyle={{ fontWeight: 'bold' }}
//         disabled={loading}
//       >
//         Sign up with Google
//       </Button>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: '#E8F5E9',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     fontWeight: 'bold',
//     color: '#2E7D32',
//     textAlign: 'center',
//   },
//   input: { marginBottom: 15 },
//   button: { marginTop: 10 },
//   link: { marginTop: 10, textAlign: 'center' },
//   divider: { height: 1, backgroundColor: '#ccc', marginVertical: 24 },
//   googleButton: { backgroundColor: '#2E7D32', borderRadius: 6 },
// });

// app/SignupScreen.js
import { SERVER_IP } from '@env';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';

const NODE_BASE_URL = `http://${SERVER_IP}:5001`;

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const hasLower = /[a-z]/;
const hasUpper = /[A-Z]/;
const hasDigit = /\d/;
const hasSpecial = /[^A-Za-z0-9]/;

export default function SignupScreen({ navigation, setIsLoggedIn }) {
  const [username, setUsername] = useState(''); // NEW
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
  });
  const [loading, setLoading] = useState(false);

  // ---------- validation ----------
  const emailValid = useMemo(() => emailRegex.test(email), [email]);

  // strength rules per your spec:
  // - weak: only lowercase letters
  // - moderate: letters + numbers (no special/caps required)
  // - strong: letters + numbers + uppercase + special
  const strength = useMemo(() => {
    if (!password) return 'none';
    const onlyLower = password.length >= 1 && /^[a-z]+$/.test(password);
    if (onlyLower) return 'weak';

    const letters = /[A-Za-z]/.test(password);
    if (
      letters &&
      hasDigit.test(password) &&
      !(hasUpper.test(password) && hasSpecial.test(password))
    ) {
      return 'moderate';
    }
    if (
      letters &&
      hasDigit.test(password) &&
      hasUpper.test(password) &&
      hasSpecial.test(password)
    ) {
      return 'strong';
    }
    // agar match na ho to default moderate/weak ke beech
    return hasDigit.test(password) ? 'moderate' : 'weak';
  }, [password]);

  const canSubmit =
    username.trim().length >= 3 &&
    username.trim().length <= 10 &&
    emailValid &&
    password.length >= 1;

  // ---------- handlers ----------
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
        // backend ko username bhi jaa raha hai
        body: JSON.stringify({ email, password, username }),
      });

      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error('Invalid server response');
      }

      if (res.ok) {
        const user = data.user || {};
        const safeEmail = user.email || email || '';
        const safeUsername = user.username || username || '';
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
          ['name', safeUsername], // drawer/header isko read karta hai
          ['roverId', safeRoverId],
          ['avatarUrl', safeAvatar],
        ]);

        setIsLoggedIn(true);
        navigation.navigate('MainApp');
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

  const handleGoogleSignIn = () => {
    Alert.alert('Google Sign In', 'This will be added soon!');
    // TODO: expo-auth-session / Firebase Auth integrate here
  };

  // ---------- UI ----------
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
      <HelperText type={usernameValidType(username)} visible={touched.username}>
        {usernameMessage(username)}
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
        <PasswordStrength strength={strength} />
      ) : (
        <HelperText type="info" visible>
          Tip: use Uppercase + numbers + special char for a strong password.
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

      {/* Divider + Google Sign In (green) */}
      <View style={styles.divider} />
      <Button
        icon={() => <AntDesign name="google" size={20} color="white" />}
        mode="contained"
        onPress={handleGoogleSignIn}
        style={styles.googleButton}
        labelStyle={{ fontWeight: 'bold' }}
        disabled={loading}
      >
        Sign up with Google
      </Button>
    </KeyboardAvoidingView>
  );
}

/* ---------- Small helpers ---------- */
function usernameValidType(username) {
  if (!username) return 'info';
  if (username.trim().length < 3) return 'error';
  if (username.trim().length > 10) return 'error';
  return 'info';
}
function usernameMessage(username) {
  if (!username) return '3–10 chars, no spaces';
  const len = username.trim().length;
  if (len < 3) return 'Too short (min 3)';
  if (len > 10) return 'Too long (max 10)';
  return 'Looks good ✅';
}

function PasswordStrength({ strength }) {
  let text = '';
  let color = '#999';
  if (strength === 'weak') {
    text = 'Weak — only lowercase letters';
    color = '#e53935';
  } else if (strength === 'moderate') {
    text = 'Moderate — letters + numbers';
    color = '#fb8c00';
  } else if (strength === 'strong') {
    text = 'Strong — includes UPPER + numbers + special';
    color = '#2E7D32';
  } else {
    text = '';
  }
  if (!text) return null;
  return <Text style={{ color, marginTop: -8, marginBottom: 8 }}>{text}</Text>;
}

/* ---------- Styles ---------- */
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
  divider: { height: 1, backgroundColor: '#ccc', marginVertical: 24 },
  googleButton: { backgroundColor: '#2E7D32', borderRadius: 6 },
});
