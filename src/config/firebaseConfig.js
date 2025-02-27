import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { getFirestore, collection, doc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9RIwWfhqW_9l6Hpbk5CfM7NWhbxP9VEU",
  authDomain: "arrahmantourapp.firebaseapp.com",
  projectId: "arrahmantourapp",
  storageBucket: "arrahmantourapp.firebasestorage.app",
  messagingSenderId: "269446727510",
  appId: "1:269446727510:android:30342ab5a0e8c4e80b78f7",
};

// Ensure Firebase is initialized only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage), // Use AsyncStorage for persistence
});

const db = getFirestore(app);

export { auth, db, collection, doc }; // Export Firestore functions as well

