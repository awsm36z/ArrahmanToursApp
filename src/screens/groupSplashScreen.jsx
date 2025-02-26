
import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert
} from 'react-native';

const GroupSplashScreen = ({navigation}) => {
    const db = firestore();
    const groupId = "group2023"; // adjust if needed or pass as a prop
    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the group document from Firestore on mount
    useEffect(() => {

        const fetchGroup = async () => {
            try {
                const groupDoc = firestore().collection('groups').doc(groupId);
                return groupDoc.onSnapshot(
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
            } catch (error) {
                console.error("Error fetching group data:", error);
            }
        }
        fetchGroup();
    }, [db, groupId]);

    // Function to add a new member to the Firestore group document
    const addMember = async () => {
        const newUserID = prompt("Enter the new user's ID:");
        if (!newUserID) return;
        const role = prompt("Enter the new user's role (admin/member):", "member") || "member";
        const newUser = {
            userID: newUserID,
            role,
            userRef: `/users/${newUserID}` // assumes user documents are stored in /users
        };

        try {
            const groupRef = doc(db, "groups", groupId);
            await updateDoc(groupRef, {
                users: arrayUnion(newUser)
            });
            // Update local state
            setGroupData(prev => ({
                ...prev,
                users: [...(prev.users || []), newUser]
            }));
        } catch (error) {
            console.error("Error adding member:", error);
        }
    };

    // Function to remove a member from the Firestore group document
    const removeMember = async (user) => {
        if (window.confirm(`Are you sure you want to remove ${user.userID}?`)) {
            try {
                const groupRef = doc(db, "groups", groupId);
                await updateDoc(groupRef, {
                    users: arrayRemove(user)
                });
                setGroupData(prev => ({
                    ...prev,
                    users: prev.users.filter(u => u.userID !== user.userID)
                }));
            } catch (error) {
                console.error("Error removing member:", error);
            }
        }
    };

    if (loading) {
        return (
          <View style={styles.loadingContainer}>
            <Text>Loading group data...</Text>
          </View>
        );
      }
    
      return (
        <View style={styles.container}>
          <Text style={styles.header}>Group: {groupId}</Text>
          <Text style={styles.subHeader}>Members</Text>
          <ScrollView 
            horizontal 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            showsHorizontalScrollIndicator={false}
          >
            {groupData && groupData.users && groupData.users.length > 0 ? (
              groupData.users.map((user, index) => (
                <View key={index} style={styles.memberCard}>
                  <Image 
                    source={{ uri: 'https://via.placeholder.com/100' }} 
                    style={styles.avatar} 
                  />
                  <Text style={styles.userText}>{user.userID}</Text>
                  <Text style={styles.userSubText}>{user.role}</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      Alert.alert(
                        'Remove Member',
                        `Are you sure you want to remove ${user.userID}?`,
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'OK', onPress: () => removeMember(user) }
                        ]
                      );
                    }}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text>No members in this group.</Text>
            )}
          </ScrollView>
          <TouchableOpacity 
            onPress={addMember}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add Member</Text>
          </TouchableOpacity>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      container: {
        padding: 20,
        maxWidth: 800,
        alignSelf: 'center',
        flex: 1,
        backgroundColor: '#f9f9f9',
      },
      header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      subHeader: {
        fontSize: 20,
        marginBottom: 10,
      },
      scrollView: {
        marginBottom: 20,
      },
      scrollContent: {
        alignItems: 'center',
      },
      memberCard: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        width: 140,
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: '#fff',
        // Shadow properties for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Elevation for Android
        elevation: 2,
      },
      avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
      },
      userText: {
        marginBottom: 5,
        fontWeight: '500',
      },
      userSubText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 10,
      },
      removeButton: {
        backgroundColor: '#e74c3c',
        borderRadius: 4,
        paddingVertical: 5,
        paddingHorizontal: 10,
      },
      removeButtonText: {
        color: '#fff',
        fontSize: 12,
      },
      addButton: {
        backgroundColor: '#2ecc71',
        borderRadius: 4,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: 'center',
      },
      addButtonText: {
        color: '#fff',
        fontSize: 16,
      },
    });
    
    export default GroupSplashScreen;