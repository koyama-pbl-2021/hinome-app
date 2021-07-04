import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
/* screens */
import { LogInScreen } from '../screens/LogInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
/* types */
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#000',
      }}
    >
      <Stack.Screen
        name="LogIn"
        component={LogInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
