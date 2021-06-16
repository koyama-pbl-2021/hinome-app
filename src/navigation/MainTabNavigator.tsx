import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather, Entypo } from "@expo/vector-icons";
/* navigators */
/* screens */
import { HomeScreen } from "../screens/HomeScreen";
import { HinomeScreen } from "../screens/HinomeScreen";
/* contexts */

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

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

export const MainTabNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: "#900",
          inactiveTintColor: "#999",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" color={color} size={size} />
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
    </NavigationContainer>
  );
};
