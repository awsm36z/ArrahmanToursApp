import { auth } from '../config/firebaseConfig';
import { db } from '../config/firebaseConfig'; // Ensure Firestore is available
import { doc, setDoc } from "firebase/firestore";

// Create User function to store user details in Firestore
export async function createUser(uid, firstName, lastName, preferredName, phoneNumber) {
  if (!uid) throw new Error("User ID is required");

  const userDocRef = doc(db, "users", uid); // Correct Firestore reference

  try {
    await setDoc(userDocRef, {
      firstName,
      lastName,
      preferredName,
      phoneNumber,  // Save the phone number
      createdAt: new Date().toISOString()
    });
    console.log("User document successfully created!");
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
  }
}

export function getCurrentUser() {
  return auth.currentUser; // Correctly return the authenticated user
}
