import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';

async function onAppleButtonPress() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token returned');
    }

    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

    return auth().signInWithCredential(appleCredential);
}

const SignUpScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Arrahman Tour App</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            {/* Apple Sign-In Button */}
            <AppleButton
                buttonStyle={AppleButton.Style.BLACK}
                buttonType={AppleButton.Type.SIGN_IN}
                style={styles.appleButton}
                onPress={() =>
                    onAppleButtonPress().then(() => console.log('Apple sign-in complete!'))
                }
            />

            <TouchableOpacity style={styles.signInButton} onPress={() => console.log('Facebook sign-in pressed')}>
                <Text style={styles.signInButtonText}>Sign in with Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signInButton} onPress={() => console.log('Google sign-in pressed')}>
                <Text style={styles.signInButtonText}>Sign in with Google</Text>
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
