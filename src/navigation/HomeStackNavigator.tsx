import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
/* components */
import { LogOutButton } from '../components/LogOutButton';
/* screens */
import { HomeScreen } from '../screens/HomeScreen';
import { AlbumScreen } from '../screens/AlbumScreen';
/* types */
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export const HomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTintColor: '#fff',
        headerRight: () => <LogOutButton />,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: 'アルバム' }}
      />
      <Stack.Screen
        name="Album"
        component={AlbumScreen}
        options={{ headerTitle: '写真' }}
      />
    </Stack.Navigator>
  );
};
