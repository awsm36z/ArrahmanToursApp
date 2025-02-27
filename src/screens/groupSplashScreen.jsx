import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import { subscribeToUserDoc } from '../functions/firestoreService';
import { signOutUser, getCurrentUser } from '../functions/authService';

const HomeScreen = ({ navigation }) => {
  const [firestoreUser, setFirestoreUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.error('No authenticated user found!');
      return;
    }
    // Subscribe to the user's Firestore document
    const unsubscribe = subscribeToUserDoc(
      currentUser.uid,
      (data) => setFirestoreUser(data),
      (error) => console.error(error)
    );
    return () => unsubscribe();
  }, []);

  // When the user document updates, check if they belong to a single group.
  useEffect(() => {
    if (firestoreUser && firestoreUser.groups) {
      if (firestoreUser.groups.length === 1) {
        // Automatically navigate if only one group exists
        navigation.reset({
          index: 0,
          routes: [{ name: 'GroupPage', params: { groupId: firestoreUser.groups[0] } }],
        });
      }
    }
  }, [firestoreUser, navigation]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      Alert.alert('Success', 'You have been logged out.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'App Start' }],
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Render each group in the list if the user is in multiple groups.
  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => navigation.navigate('GroupPage', { groupId: item })}
    >
      <Text style={styles.groupText}>Group: {item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {firestoreUser ? (
        <>
          <Text style={styles.text}>
            Welcome, {firestoreUser.name?.preferredName || 'No name'}!
          </Text>
          {firestoreUser.groups && firestoreUser.groups.length > 1 && (
            <>
              <Text style={styles.subHeader}>Your Groups</Text>
              <FlatList
                data={firestoreUser.groups}
                keyExtractor={(item) => item}
                renderItem={renderGroupItem}
                contentContainerStyle={styles.groupsList}
              />
            </>
          )}
          {(!firestoreUser.groups || firestoreUser.groups.length === 0) && (
            <Text style={styles.text}>You are not in any groups yet.</Text>
          )}
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  groupsList: {
    alignItems: 'center',
  },
  groupItem: {
    backgroundColor: '#EEE',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  groupText: {
    fontSize: 16,
    color: '#333',
  },
});
