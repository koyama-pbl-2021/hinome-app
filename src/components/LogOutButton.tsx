import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
/* lib */
import { logOut } from '../lib/firebase';
/* context*/
import { UserContext } from '../contexts/UserContext';
import { AlbumContext } from '../contexts/AlbumContext';

export const LogOutButton: React.FC = () => {
  const { setUser } = useContext(UserContext);
  const { setAlbum } = useContext(AlbumContext);
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
            onPress: async () => {
              await Notifications.cancelAllScheduledNotificationsAsync();
              await logOut();
              setAlbum(null);
              setUser(null);
            },
          },
        ]);
      }}
    />
  );
};
