import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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

  // Optionally check if the collection exists (debug/logging)
  await checkCollectionExists('users');

  // Reference to this user's doc
  const userDocRef = firestore().collection('users').doc(currentUser.uid);

  try {
    const documentSnapshot = await userDocRef.get();

    // Data we want to store/update
    const userData = {
      displayName: currentUser.displayName,    // This was set to preferredName above
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
