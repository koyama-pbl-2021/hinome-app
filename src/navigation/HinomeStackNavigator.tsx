import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
/* components */
import { HelpButton } from '../components/HelpButton';
/* screens */
import { HinomeScreen } from '../screens/HinomeScreen';
import { TimeSelectScreen } from '../screens/TimeSelectScreen';
import { HinomeStartScreen } from '../screens/HinomeStartScreen';
import { MultipleStartScreen } from '../screens/MultipleStartScreen';
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
        name="MultipleStart"
        component={MultipleStartScreen}
        options={{ headerTitle: '' }}
      />
      <Stack.Screen
        name="TimeSelect"
        component={TimeSelectScreen}
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
