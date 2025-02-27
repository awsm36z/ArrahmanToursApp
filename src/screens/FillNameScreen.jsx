import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { auth } from '../config/firebaseConfig'; // Use initialized Firebase
import { createUser } from '../functions/authService'; // Ensure createUser function is imported
import { updateProfile } from "firebase/auth";
import phoneValidator from 'phone'; // Import the phone validator library

const FillNameScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // New state for phone number

  const handleSaveName = async () => {
      if (!firstName.trim() || !lastName.trim() || !preferredName.trim() || !phoneNumber.trim()) {
          Alert.alert('Error', 'Please fill in all fields.');
          return;
      }

      // Validate phone number
      const phoneValidation = phoneValidator(phoneNumber);
      if (!phoneValidation.isValid) {
          Alert.alert('Error', 'Please enter a valid phone number.');
          return;
      }

      try {
          const user = auth.currentUser; // Get logged-in user
          if (!user) {
              Alert.alert('Error', 'No user found. Please sign in again.');
              return;
          }

          // Save user data including phone number
          await createUser(user.uid, firstName, lastName, preferredName, phoneNumber);

          // Correct way to update profile
          await updateProfile(user, { displayName: preferredName });

          Alert.alert('Success', 'Name and phone number saved successfully!');
          navigation.navigate('Home'); // Navigate to the Home screen after saving
      } catch (error) {
          console.error('Error updating user profile:', error);
          Alert.alert('Error', 'An error occurred while saving your information.');
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fill out your information</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#888"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#888"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Preferred Name"
        placeholderTextColor="#888"
        value={preferredName}
        onChangeText={setPreferredName}
      />

      {/* Phone Number Input */}
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveName}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FillNameScreen;

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
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


