import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { subscribeToUserDoc, getGroupData } from '../functions/firestoreService';
import { signOutUser, getCurrentUser } from '../functions/authService';
import GroupCard from '../components/groupCard';

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [firestoreUser, setFirestoreUser] = useState(null);
  const [groupsData, setGroupsData] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  useEffect(() => {
    // Get the currently authenticated user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.error('No authenticated user found!');
      return;
    }
    // Subscribe to the user's document
    const unsubscribe = subscribeToUserDoc(
      currentUser.uid,
      (data) => setFirestoreUser(data),
      (error) => console.error(error)
    );
    return () => unsubscribe();
  }, []);

  // When firestoreUser updates, fetch each group's data
  useEffect(() => {
    const fetchGroups = async () => {
      if (firestoreUser && firestoreUser.groups && firestoreUser.groups.length > 0) {
        setLoadingGroups(true);
        try {
          const fetchedGroups = await Promise.all(
            firestoreUser.groups.map(async (groupId) => {
              const data = await getGroupData(groupId);
              return { groupId, ...data };
            })
          );
          setGroupsData(fetchedGroups);
        } catch (error) {
          console.error('Error fetching groups:', error);
        } finally {
          setLoadingGroups(false);
        }
      }
    };
    fetchGroups();
  }, [firestoreUser]);

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

  /** handle onPress for the add group button, onButtonPress 
   * navigate to create group page.
  */
  const navCreateGroupPage = () => {
    navigation.navigate('Create Group');
  };

  return (
    // Wrap the content in a container that applies the safe area insets.
    <View style={[styles.safeContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.banner}>
        <TouchableOpacity style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>btn</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.bannerButton} onPress={()=> navCreateGroupPage()}>
          <Text style={styles.bannerButtonText}>Add Group</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mainContent}>
        {firestoreUser ? (
          <>
            <Text style={styles.text}>
              Welcome, {firestoreUser.name?.preferredName || 'No name'}!
            </Text>
            {loadingGroups ? (
              <ActivityIndicator size="large" color="#6200EE" />
            ) : (
              <View style={styles.cardContainer}>
                {groupsData.length > 0 ? (
                  groupsData.map((group) => (
                    <GroupCard
                      key={group.groupId}
                      groupId={group.groupId}
                      groupName={group.groupName || `Group ${group.groupId.substring(0, 6)}`}
                      onPress={() => navigation.navigate('Group Splash', { groupId: group.groupId })}
                    />
                  ))
                ) : (
                  <Text style={styles.text}>You are not in any groups yet.</Text>
                )}
              </View>
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
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  banner: {
    backgroundColor: '#6200EE',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerButton: {
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 8,
  },
  bannerButtonText: {
    color: '#6200EE',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bannerText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 8,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
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
});