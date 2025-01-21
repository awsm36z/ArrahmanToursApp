import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AppStart from './src/screens/appStart';
import SignUpScreen from './src/screens/signupScreen';
import HomeScreen from './src/screens/homeScreen';
import TestScreen from './src/screens/testScreen';
import EmailSignUp from './src/screens/emailSignUp';

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Sign Up">
          <Stack.Screen name="App Start" component={AppStart} />
          <Stack.Screen name="Sign Up" component={SignUpScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Email" component={EmailSignUp} />
          <Stack.Screen name="Test" component={TestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
