import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { subscribeToUserDoc } from '../functions/firestoreService'
import { signOutUser, getCurrentUser } from '../functions/authService';

const HomeScreen = ({ navigation }) => {
  const [firestoreUser, setFirestoreUser] = useState(null);

  useEffect(() => {
    // 1. Get the currently authenticated user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.error('No authenticated user found!');
      return;
    }
    // 2. Subscribe to the user doc,
    const unsubscribe = subscribeToUserDoc(
      currentUser.uid,
      (data) => setFirestoreUser(data),
      (error) => console.error(error)
    );

    // Cleanup
    return () => unsubscribe();
  }, []);


  const handleSignOut = async () => {
    try {
      await signOutUser();
      Alert.alert('Success', 'You have been logged out.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'App Start' }],
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {firestoreUser ? (
        <>
          <Text style={styles.text}>
            Welcome, {firestoreUser.name["preferredName"] || 'No name'}!
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeScreen;

// Styles
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
