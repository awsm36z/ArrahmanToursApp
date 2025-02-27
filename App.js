import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AppStart from './src/screens/appStart';
import SignInScreen from './src/screens/SignIn';
import HomeScreen from './src/screens/homeScreen';
import TestScreen from './src/screens/testScreen';
import EmailSignUp from './src/screens/emailSignUp';
import EmailLogIn from './src/screens/emailLogIn';
import FillNameScreen from './src/screens/FillNameScreen';
import TwoFactorAuth from './src/screens/TwoFactorAuth';
import ChangePassword from './src/screens/changePassword';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
          initialRouteName="App Start"
          screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="App Start" component={AppStart} />
        <Stack.Screen name="Sign In" component={SignInScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Email Sign Up" component={EmailSignUp} />
        <Stack.Screen name="Test" component={TestScreen} />
        <Stack.Screen name="Email Sign In" component={EmailLogIn} />
        <Stack.Screen name="Fill Name" component={FillNameScreen} />
        <Stack.Screen name="Two Factor Auth" component={TwoFactorAuth} />
        <Stack.Screen name="Change Password" component={ChangePassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

