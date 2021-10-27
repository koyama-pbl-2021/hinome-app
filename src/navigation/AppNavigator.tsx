import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
/* screens */
import { AuthScreen } from '../screens/AuthScreen';
/* navigators */
import { MainTabNavigator } from './MainTabNavigator';
/* contexts */
import { UserContext } from '../contexts/UserContext';

export const AppNavigator: React.FC = () => {
  const { user } = useContext(UserContext);
  // 認証情報が存在しなければAuthScreenへ飛ばし匿名認証を行う、存在していればホーム画面へ
  return (
    <NavigationContainer>
      {!user ? <AuthScreen /> : <MainTabNavigator />}
    </NavigationContainer>
  );
};
