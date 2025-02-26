import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
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

/**
 * Creates a new group object in the group collection based on inputted groupName parameter. automatically adds self 
 * as admin. Follows the following schema:
 * GroupName: {groupDocuments:[], groupMembers:[{userID: string, role: string, userRef: string}]}
 * function is called createGroup
 * @param {string} groupName - The name of the group to create
 * @returns {Promise<void>}
 */
export async function createGroup(groupName) {
  const currentUser = auth().currentUser;
  console.log(`User: ${currentUser}`);

  // Create a new document reference with an auto-generated ID
  const groupRef = firestore().collection('groups').doc();
  
  const newGroup = {
    groupName: groupName,
    groupDocuments: [],
    groupMembers: {
      [currentUser.uid]: {
        role: 'admin',
        userRef: `/users/${currentUser.uid}`
      }
    },
    createdAt: firestore.FieldValue.serverTimestamp() // Optionally add a creation timestamp
  };

  try {
    await groupRef.set(newGroup);
    console.log('Group created successfully with ID:', groupRef.id);

    // Add the group ID to the user's group list
    const userRef = firestore().collection('users').doc(currentUser.uid);
    await userRef.update({
      groups: firestore.FieldValue.arrayUnion(groupRef.id)
    });
    console.log('Group added to user document successfully!');
  } catch (error) {
    console.error('Error creating group:', error);
  } 
}



/**
 * Adds a new member to the Firestore group document
 * @param {string} groupId - The unique ID of the group
 * @param {string} newUserID - The new user's ID
 * @param {string} role - The new user's role (admin/member)
 * @returns {Promise<void>}
 */

export async function addMember(groupId, newUserID, role) {
  const newUser = {
    userID: newUserID,
    role,
    userRef: `/users/${newUserID}`
  };

  try {
    const groupRef = firestore().collection('groups').doc(groupId);
    await groupRef.update({
      groupMembers: firestore.FieldValue.arrayUnion(newUser)
    });
    console.log('Member added successfully!');
  } catch (error) {
    console.error('Error adding member:', error);
  }
}