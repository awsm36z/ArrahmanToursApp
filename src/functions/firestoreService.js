import { db, doc, collection } from '../config/firebaseConfig'; // Ensure correct imports
import { getDoc, onSnapshot } from "firebase/firestore"; // Import required Firestore functions

export function subscribeToUserDoc(uid, onData, onError) {
  const userDocRef = doc(collection(db, 'users'), uid); // Correct Firestore reference

  const unsubscribe = onSnapshot(
    userDocRef,
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        onData(docSnapshot.data());
      } else {
        console.log('No such user document in Firestore!');
        onData(null);
      }
    },
    (error) => {
      console.error('Error fetching user document:', error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}
