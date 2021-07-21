import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
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
        headerTintColor: '#000',
      }}
    >
      <Stack.Screen
        name="Hinome"
        component={HinomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HinomeStart"
        component={HinomeStartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
