import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
/* components */
import { LogOutButton } from '../components/LogOutButton';
/* screens */
import { HinomeScreen } from '../screens/HinomeScreen';
import { HinomeStartScreen } from '../screens/HinomeStartScreen';
import { CameraScreen } from '../screens/CameraScreen';
/* types */
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export const HinomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTintColor: '#fff',
        headerRight: () => <LogOutButton />,
      }}
    >
      <Stack.Screen
        name="Hinome"
        component={HinomeScreen}
        options={{ headerTitle: '' }}
      />
      <Stack.Screen
        name="HinomeStart"
        component={HinomeStartScreen}
        options={{ headerTitle: '' }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
