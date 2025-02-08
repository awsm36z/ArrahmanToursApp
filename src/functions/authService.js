import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

//sign out function
export async function signOutUser() {
  return auth().signOut();
}

//retrieve current user
export function getCurrentUser() {
  return auth().currentUser;
}

/**
 * Subscribes to the Firestore user doc for the given uid for updated user data.
 * @param {string} uid - The user's unique Firebase Auth UID
 * @param {function} onData - Called with the Firestore data if doc exists (or null if missing)
 * @param {function} onError - Called if an error occurs
 * @returns {function} unsubscribe() - Call this to stop listening
 */
export function subscribeToUserDoc(uid, onData, onError) {
  const userDocRef = firestore().collection('users').doc(uid);

  return userDocRef.onSnapshot(
    (docSnapshot) => {
      if (docSnapshot.exists) {
        onData(docSnapshot.data());
      } else {
        console.log('No user document found in Firestore for UID:', uid);
        onData(null);
      }
    },
    (error) => {
      console.error('Error fetching user document:', error);
      onError?.(error); // optional callback
    }
  );
}

/**
 * Creates or updates a user document in Firestore.
 * If the document for the current authenticated user does not exist,
 * it creates one using the user's UID. If it exists, it updates the document.
 */
export async function createUser(firstName, lastName, preferredName) {


  const currentUser = auth().currentUser;
  if (!currentUser) {
    console.error('No authenticated user found.');
    return;
  }

  // Reference to this user's doc
  const userDocRef = firestore().collection('users').doc(currentUser.uid);

  try {
    const documentSnapshot = await userDocRef.get();

    // Data we want to store/update
    const userData = {
      displayName: currentUser.displayName,   
      email: currentUser.email,
      is_verified: currentUser.emailVerified,
      phone: currentUser.phoneNumber,
      role: 'user',
      name: {
        firstName: firstName,
        lastName: lastName,
        preferredName: preferredName,
        fullName: `${firstName} ${lastName}`,
      },
    };

    if (documentSnapshot.exists) {
      // Update user if doc exists
      await userDocRef.update(userData);
      console.log('User updated!');
    } else {
      // Create new user doc if it doesn't exist
      await userDocRef.set(userData);
      console.log('User created!');
    }
  } catch (error) {
    console.error('Error creating/updating user document:', error);
  }
}





//Old debugging function to check if a collection exists
const checkCollectionExists = async (collectionName) => {
  try {
    const snapshot = await firestore().collection(collectionName).limit(1).get();
    if (!snapshot.empty) {
      console.log(`Collection '${collectionName}' exists.`);
      return true;
    } else {
      console.log(`Collection '${collectionName}' does not exist or is empty.`);
      return false;
    }
  } catch (error) {
    console.error('Error checking collection existence:', error);
    return false;
  }
};