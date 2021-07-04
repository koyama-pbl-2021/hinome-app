import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather, Entypo, MaterialIcons } from "@expo/vector-icons";
/* navigators */
import { HomeStackNavigator } from "./HomeStackNavigator";
/* screens */
import { HinomeScreen } from "../screens/HinomeScreen";
import { CameraScreen } from "../screens/CameraScreen";
/* contexts */

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HinomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Hinome"
        component={HinomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const CameraStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "#900",
        inactiveTintColor: "#999",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraStack}
        options={{
          tabBarLabel: "Camera",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="featured-video" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Hinome"
        component={HinomeStack}
        options={{
          tabBarLabel: "Hinome",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="adjust" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
