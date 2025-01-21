import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null); // Initialize user state

  useEffect(() => {
    // Get the currently authenticated user
    const currentUser = auth().currentUser;
    setUser(currentUser); // Set the user in state
  }, []);

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      Alert.alert('Success', 'You have been logged out.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'App Start' }], // Navigate back to the App Start screen
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.text}>Welcome, {user.email}!</Text>
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.text}>No user is currently logged in.</Text>
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
  },
  text: {
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
