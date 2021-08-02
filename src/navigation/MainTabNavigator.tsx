import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, Entypo, AntDesign, analytics } from '@expo/vector-icons';
/* navigators */
import { HomeStackNavigator } from './HomeStackNavigator';
import { HinomeStackNavigator } from './HinomeStackNavigator';
import { AnalysisStackNavigator } from './AnalysisStackNavigator';

const Tab = createBottomTabNavigator();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#900',
        inactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Hinome"
        component={HinomeStackNavigator}
        options={{
          tabBarLabel: 'Hinome',
          tabBarIcon: ({ color, size }) => (
            <Entypo name="adjust" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Analysis"
        component={AnalysisStackNavigator}
        options={{
          tabBarLabel: 'analytics',
          tabBarIcon: ({ color, size }) => (
            <AntDesign analytics="analytics" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
