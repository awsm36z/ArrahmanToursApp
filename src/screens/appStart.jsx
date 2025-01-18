import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';

async function onAppleButtonPress(navigation) {
    try {
        // Start the sign-in request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        // Ensure Apple returned a user identityToken
        if (!appleAuthRequestResponse.identityToken) {
            throw new Error('Apple Sign-In failed - no identity token returned');
        }

        // Create a Firebase credential from the response
        const { identityToken, nonce } = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

        // Sign the user in with the credential
        const userCredential = await auth().signInWithCredential(appleCredential);

        // Navigate to the Home screen on successful login
        console.log('Apple sign-in successful!', userCredential.user);
        navigation.navigate('Home');
    } catch (error) {
        console.error('Apple sign-in failed:', error);
    }
}

const SignUpScreen = ({ navigation }) => {
    useEffect(() => {
        // Optional: Check if the user is already signed in and redirect to Home
        const unsubscribe = auth().onAuthStateChanged((user) => {
            if (user) {
                navigation.navigate('Home');
            }
        });
        return unsubscribe; // Cleanup on unmount
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Arrahman Tour App</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            {/* Apple Sign-In Button */}
            <AppleButton
                buttonStyle={AppleButton.Style.BLACK}
                buttonType={AppleButton.Type.SIGN_IN}
                style={styles.appleButton}
                onPress={() => onAppleButtonPress(navigation)}
            />

            {/* Placeholder for other sign-in methods */}
            <TouchableOpacity
                style={styles.signInButton}
                onPress={() => console.log('Google sign-in pressed')}
            >
                <Text style={styles.signInButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.signInButton}
                onPress={() => console.log('Facebook sign-in pressed')}
            >
                <Text style={styles.signInButtonText}>Sign in with Facebook</Text>
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
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 32,
    },
    appleButton: {
        width: 250,
        height: 50,
        marginBottom: 16,
    },
    signInButton: {
        backgroundColor: '#4285F4', // Google blue for demo
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginBottom: 16,
        width: 250,
        alignItems: 'center',
        elevation: 3, // Add shadow for Android
        shadowColor: '#000', // Add shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    signInButtonText: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default SignUpScreen;
