import React, { useState } from "react";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { MainTabNavigator } from "./src/navigation/MainTabNavigator";

export default function App() {
  return <MainTabNavigator />;
}
