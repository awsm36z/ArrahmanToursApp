import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';


const AppStart = ({navigation}) => {
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);



    if (initializing) return (
        <View style={styles.container}>
            <Text>loading</Text>
        </View>
    );;

    if (!user) {
        if (navigation.canGoBack()) return null; // Prevent repeated navigation
        navigation.navigate('Sign Up');
        return null; // Ensure navigation happens only once
    }
    
    if (user) {
        if (navigation.canGoBack()) return null; // Prevent repeated navigation
        navigation.navigate('Home');
        return null; // Ensure navigation happens only once
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
});



export default AppStart;