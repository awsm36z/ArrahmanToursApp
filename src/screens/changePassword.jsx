import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../config/firebaseConfig'; // Firebase Auth import
import { sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth';

const ChangePassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState(''); // For password reset verification

  // Step 1: Send password reset email
  const handlePasswordResetRequest = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Check Your Email',
        'A password reset link has been sent to your email.',
        [{ text: 'OK', onPress: () => navigation.navigate('Sign In') }]
      );
    } catch (error) {
      console.error("Error sending password reset email:", error);
      Alert.alert('Error', 'Failed to send password reset email.');
    }
  };

  // Step 2: Allow the user to change their password after email verification
  const handlePasswordChange = async () => {
    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter your new password.');
      return;
    }

    try {
      await confirmPasswordReset(auth, confirmationCode, newPassword);
      Alert.alert('Success', 'Your password has been changed successfully!');
      navigation.navigate('Sign In'); // Navigate to the Sign-In screen after password change
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert('Error', 'Failed to change password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      {/* Step 1: Enter Email for Password Reset */}
      {!confirmationCode ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.button} onPress={handlePasswordResetRequest}>
            <Text style={styles.buttonText}>Send Reset Link</Text>
          </TouchableOpacity>
        </>
      ) : (
        // Step 2: Enter New Password after receiving the reset link
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor="#888"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter the reset code"
            placeholderTextColor="#888"
            value={confirmationCode}
            onChangeText={setConfirmationCode}
          />
          <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Navigate to Sign In if the user is already logged in */}
      <TouchableOpacity onPress={() => navigation.navigate('Sign In')}>
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

export default ChangePassword;
