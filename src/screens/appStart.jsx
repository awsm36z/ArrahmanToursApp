import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../config/firebaseConfig'; // Use initialized Firebase
import { onAuthStateChanged } from "firebase/auth"; // Import correct method

const AppStart = ({ navigation }) => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

    // Handle user state changes
    useEffect(() => {
        const subscriber = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log('\n\nUser:', currentUser, "\n\n");
            setInitializing(false);
        });

        return subscriber; // Cleanup subscription on unmount
    }, []);

    // Navigate to Home if user is logged in
   useEffect(() => {
     if (!initializing) {
       if (user) {
         if (!user.emailVerified) {
           navigation.reset({ index: 0, routes: [{ name: 'Sign In' }] });
         } else {
           navigation.navigate('Sign In');
         }
       } else {
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
