import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import { auth } from '../config/firebaseConfig'; // Ensure correct import
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth"; // Import correct Firebase methods

GoogleSignin.configure({
  iosClientId: "825006931797-gud8809i2cj9m49j7mabvrlomg9ghpl8.apps.googleusercontent.com"
});

async function onGoogleButtonPress() {
  console.log("Google Sign-In button pressed");

  try {
    console.log("Step 1: Checking Play Services");
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    console.log("Step 2: Signing in");
    const signInResult = await GoogleSignin.signIn();
    console.log("signInResult:", signInResult);

    let idToken = signInResult.idToken;
    if (!idToken) {
      throw new Error('No ID token found');
    }

    console.log("Step 3: Creating credential");
    const googleCredential = GoogleAuthProvider.credential(idToken); // ✅ Corrected

    console.log("Step 4: Signing in with credential");
    const userCred = await signInWithCredential(auth, googleCredential); // ✅ Corrected
    console.log("Firebase user:", userCred.user);
  } catch (error) {
    console.error("Google Sign-In error:", error);
  }
}

const SignInScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Arrahman Tour App</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {/* Apple Sign-In (for iOS users) */}
      {Platform.OS === 'ios' && (
        <View>
          <AppleButton
            buttonStyle={AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            style={styles.appleButton}
            onPress={async () => {
              try {
                const appleAuthRequestResponse = await appleAuth.performRequest({
                  requestedOperation: appleAuth.Operation.LOGIN,
                  requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
                });

                if (!appleAuthRequestResponse.identityToken) {
                  throw new Error('Apple Sign-In failed - no identity token returned');
                }

                const { identityToken, nonce } = appleAuthRequestResponse;
                const appleCredential = auth.AppleAuthProvider.credential(
                  identityToken,
                  nonce,
                );

                await auth.signInWithCredential(appleCredential);
              } catch (error) {
                console.error('Apple sign-in error:', error);
              }
            }}
          />
        </View>
      )}

      {/* Google Sign-In Button */}
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={onGoogleButtonPress}
      />

      {/* Navigate to Email Sign-In Screen */}
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => navigation.navigate('Email Sign In')}>
        <Text style={styles.signInButtonText}>Sign in with Email</Text>
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
    backgroundColor: '#4285F4',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
    width: 250,
    alignItems: 'center',
  },
  signInButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default SignInScreen;

