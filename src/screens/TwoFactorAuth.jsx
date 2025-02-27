import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, StyleSheet } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { sendEmailVerification } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from '../config/firebaseConfig'; // Ensure correct Firestore import

const TwoFactorAuth = ({ navigation }) => {
  const [otp, setOtp] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(''); // Either 'email' or 'phone'

  const handle2FAChoice = async () => {
    const user = auth.currentUser;

    if (selectedMethod === 'email') {
      try {
        await sendEmailVerification(user); // Send OTP to email
        Alert.alert('Email OTP sent', 'Please check your email for the verification code.');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    } else if (selectedMethod === 'phone') {
      try {
        // Send SMS OTP to phone number (Firebase Phone Authentication)
        const phoneAuth = await auth.signInWithPhoneNumber(phoneNumber);
        // You can now implement further OTP handling logic here.
        Alert.alert('Phone OTP sent', 'Please check your phone for the verification code.');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Error', 'Please select a 2FA method.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Two-Factor Authentication</Text>
      <Text style={styles.subtitle}>Choose your 2FA method</Text>

      <TouchableOpacity onPress={() => setSelectedMethod('email')} style={styles.button}>
        <Text style={styles.buttonText}>Email OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setSelectedMethod('phone')} style={styles.button}>
        <Text style={styles.buttonText}>Phone SMS OTP</Text>
      </TouchableOpacity>

      {selectedMethod && (
        <View>
          <TextInput
            style={styles.input}
            placeholder={selectedMethod === 'email' ? 'Enter OTP sent to your email' : 'Enter OTP sent to your phone'}
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity style={styles.button} onPress={handle2FAChoice}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      )}
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
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 12,
    width: '90%',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    height: 50,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
});

export default TwoFactorAuth;

