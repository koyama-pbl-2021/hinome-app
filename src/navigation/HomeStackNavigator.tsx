import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
/* components */
import { HelpButton } from '../components/HelpButton';
import { LogOutButton } from '../components/LogOutButton';
import { GarbageButton } from '../components/GarbageButton';

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
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <GarbageButton />
            <HelpButton />
            <LogOutButton />
          </View>
        ),
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
        options={{
          headerTitle: '写真',
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <GarbageButton />
              <HelpButton />
              <LogOutButton />
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
};
