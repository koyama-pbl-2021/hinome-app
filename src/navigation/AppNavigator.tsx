import React from "react";
import { NavigationContainer } from "@react-navigation/native";
/* navigators */
/* screens */
import { LogInScreen } from "../screens/LogInScreen";
import { SignUpScreen } from "../screens/SignUpScreen";
/* contexts */

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <LogInScreen />
    </NavigationContainer>
  );
};
