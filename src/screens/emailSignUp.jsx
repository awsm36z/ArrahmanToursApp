import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../config/firebaseConfig'; // Ensure correct import
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";

const EmailSignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ensure user is fully initialized
      await user.reload();

      // Send verification email
      await sendEmailVerification(user);

      // Check email verification status before showing the alert
      let emailVerified = false;

      // Poll the user's email verification status
      Alert.alert(
        'Email Authentication',
        'Please verify your email before proceeding.'
      );

      while (!emailVerified) {
        await user.reload();  // Reload user data to get the latest status
        emailVerified = user.emailVerified; // Check if email is verified

        if (!emailVerified) {
          await new Promise(resolve => setTimeout(resolve, 1000));  // Wait 1 second before re-checking
        }
      }

      // Once email is verified, show the alert and proceed
      Alert.alert(
        'Email Verified',
        'Your email has been verified. You can now proceed.',
        [{ text: 'OK', onPress: () => navigation.navigate('Fill Name') }]
      );

    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Confirm Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Already have an account */}
      <TouchableOpacity onPress={() => navigation.navigate('Email Sign In')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 32,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  button: {
    width: '90%',
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    fontSize: 14,
    color: '#6200EE',
    marginTop: 8,
  },
});

export default EmailSignUp;



