import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
/* components */
import { HelpButton } from '../components/HelpButton';
import { LogOutButton } from '../components/LogOutButton';
/* screens */
import { HinomeScreen } from '../screens/HinomeScreen';
import { HinomeStartScreen } from '../screens/HinomeStartScreen';
/* types */
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export const HinomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTintColor: '#fff',
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <HelpButton />
            <LogOutButton />
          </View>
        ),
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
    </Stack.Navigator>
  );
};
