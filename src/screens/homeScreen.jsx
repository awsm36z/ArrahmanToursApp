import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [firestoreUser, setFirestoreUser] = useState(null);

  useEffect(() => {
    // 1. Get the currently authenticated user
    const currentUser = auth().currentUser;
    if (!currentUser) {
      console.error('No authenticated user found!');
      return;
    }

    // 2. Reference the user's document in Firestore
    const userDocRef = firestore().collection('users').doc(currentUser.uid);

    // 3. Subscribe to the user document
    const unsubscribe = userDocRef.onSnapshot(
      docSnapshot => {
        if (docSnapshot.exists) {
          // docSnapshot.data() is your user object from Firestore
          setFirestoreUser(docSnapshot.data());
        } else {
          console.log('No such user document in Firestore!');
        }
      },
      error => {
        console.error('Error fetching user document:', error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  const handleSignOut = async () => {
    try {
      await auth().signOut();
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
          {/* Display fields from your Firestore user object */}
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
