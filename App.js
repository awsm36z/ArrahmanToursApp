import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import './gesture-handler';


import AppStart from './src/screens/appStart';
import SignUpScreen from './src/screens/signupScreen';
import SplashScreen from './src/screens/splashScreen';
import HomeScreen from './src/screens/homeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="App Start">
        <Stack.Screen name="App Start" component={AppStart} />
        <Stack.Screen name="Sign Up" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
