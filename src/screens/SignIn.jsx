import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

GoogleSignin.configure();

async function onGoogleButtonPress() {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
  // Get the users ID token
  const signInResult = await GoogleSignin.signIn();

  // Try the new style of google-sign in result, from v13+ of that module
  idToken = signInResult.data?.idToken;
  if (!idToken) {
    // if you are using older versions of google-signin, try old style result
    idToken = signInResult.idToken;
  }
  if (!idToken) {
    throw new Error('No ID token found');
  }

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(
    signInResult.data.idToken,
  );

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
}

async function onAppleButtonPress() {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identity token returned');
    }

    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    await auth().signInWithCredential(appleCredential);
  } catch (error) {
    console.error('Apple sign-in error:', error);
  }
}

const SignInScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Arrahman Tour App</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      {
        //if platform is ios, show apple sign in button
        Platform.OS === 'ios' ? (
          <View>
            <AppleButton
              buttonStyle={AppleButton.Style.BLACK}
              buttonType={AppleButton.Type.SIGN_IN}
              style={styles.appleButton}
              onPress={onAppleButtonPress}
            />
          </View>
        ) : null
      }

      {/*Google Sign In button*/}
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => {
          onGoogleButtonPress();
        }}
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
    backgroundColor: '#4285F4', // Google blue for demo
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
