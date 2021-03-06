import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
/* screens */
import { AnalysisScreen } from '../screens/AnalysisScreen';
/* types */
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export const AnalysisStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{ headerTitle: '' }}
      />
    </Stack.Navigator>
  );
};
