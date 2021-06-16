import React from "react";
import { NavigationContainer } from "@react-navigation/native";
/* navigators */
/* screens */
import { AuthScreen } from "../screens/AuthScreen";
/* contexts */

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <AuthScreen />
    </NavigationContainer>
  );
};
