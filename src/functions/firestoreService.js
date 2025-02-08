import firestore from '@react-native-firebase/firestore';

/**
 * Subscribes to the Firestore user doc for the given uid.
 * @param {string} uid - The user's unique Firebase Auth UID
 * @param {function} onData - Called with the Firestore data if doc exists (or null if missing)
 * @param {function} onError - Called if an error occurs
 * @returns {function} unsubscribe() - Call this to stop listening
 */
export function subscribeToUserDoc(uid, onData, onError) {
  const userDocRef = firestore().collection('users').doc(uid);

  const unsubscribe = userDocRef.onSnapshot(
    docSnapshot => {
      if (docSnapshot.exists) {
        onData(docSnapshot.data());
      } else {
        console.log('No such user document in Firestore!');
        onData(null);
      }
    },
    error => {
      console.error('Error fetching user document:', error);
      onError(error);
    }
  );

  return unsubscribe;
}
