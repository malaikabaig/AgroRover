// screens/SignupScreen.js
import { useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { signup } from '../services/authService';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const success = await signup(email, password);
    if (success) alert('Signed up!');
    else alert('Signup failed');
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
};

export default SignupScreen;
