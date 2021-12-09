import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
/* components */
import { HelpButton } from '../components/HelpButton';
/* screens */
import { HomeScreen } from '../screens/HomeScreen';
import { AlbumScreen } from '../screens/AlbumScreen';
import { CameraScreen } from '../screens/CameraScreen';
/* types */
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export const HomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: 'アルバム',
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <HelpButton />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Album"
        component={AlbumScreen}
        options={{
          headerTitle: '写真',
        }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          headerTitle: 'カメラ',
        }}
      />
    </Stack.Navigator>
  );
};
