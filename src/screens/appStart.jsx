import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const AppStart = ({ navigation }) => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

    // Handle user state changes
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            console.log('\n\nUser:', currentUser, "\n\n");
            setInitializing(false); // Firebase authentication initialization is complete
        });

        return subscriber; // Cleanup subscription on unmount
    }, []);

    // Navigate to Home if user is logged in
    useEffect(() => {
        if (!initializing) {
          if (user) {
            // Check if user.displayName is missing (or if Firestore data is missing)
            if (!user.displayName) {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Fill Name' }],
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            }
          } else {
            // No user logged in, go to Sign In
            navigation.navigate('Sign In');
          }
        }
      }, [initializing, user, navigation]);
      

    // Show a loading screen while Firebase initializes
    if (initializing) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    // If no user is logged in, remain on the App Start screen
    navigation.navigate
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
});

export default AppStart;
