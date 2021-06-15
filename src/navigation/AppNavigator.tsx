import React, { useCallback, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
/* navigators */
/* screens */
import { AuthScreen } from "../screens/AuthScreen";
/* contexts */
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <AuthScreen />
    </NavigationContainer>
  );
};
