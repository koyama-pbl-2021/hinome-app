import React, { useContext } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
/* lib */
import { logOut } from '../lib/firebase';
/* context*/
import { UserContext } from '../contexts/UserContext';

export const LogOutButton: React.FC = () => {
  const { setUser } = useContext(UserContext);
  return (
    <SimpleLineIcons
      style={{ marginRight: 20 }}
      name="logout"
      size={24}
      color="white"
      onPress={() => {
        Alert.alert('ログアウト', 'ログアウトしますか？', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              logOut();
              setUser(null);
            },
          },
        ]);
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 20,
  },
});
