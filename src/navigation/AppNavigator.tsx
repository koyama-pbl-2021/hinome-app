import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
/* navigators */
import { AuthStackNavigator } from './AuthStackNavigator';
import { MainTabNavigator } from './MainTabNavigator';
/* contexts */
import { UserContext } from '../contexts/UserContext';

export const AppNavigator: React.FC = () => {
  const { user } = useContext(UserContext);
  // 認証情報が存在しなければ認証画面へ飛ばす、存在していればホーム画面へ
  return (
    <NavigationContainer>
      {!user ? <AuthStackNavigator /> : <MainTabNavigator />}
    </NavigationContainer>
  );
};
