import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import SoundPlayer from '../components/soundPlayer'


const HomeScreen = ({navigation, props}) => {
    return (
        <View style={styles.container}>
            {/* <SoundPlayer soundFile="intro.mp3" /> */}
            <Text>BYYYYY {props.user.email}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
});

export default HomeScreen;