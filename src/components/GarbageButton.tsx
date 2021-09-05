import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
/* lib */
import { getAlbumRef } from '../lib/firebase';
/* context */
import { ViewAlbumContext } from '../contexts/ViewAlbumContext';
import { UserContext } from '../contexts/UserContext';

const deleteAlbum = async (userId: string, albumId: string) => {
  const albumRef = await getAlbumRef(userId, albumId);
  await albumRef.delete();
};

export const GarbageButton: React.FC = (deleteAlbum) => {
  const { viewAlbum, setViewAlbum } = useContext(ViewAlbumContext);
  const { user, setUser } = useContext(UserContext);

  return (
    <MaterialIcons
      name="delete"
      size={24}
      style={{ marginRight: 20 }}
      color="white"
      onPress={() => {
        Alert.alert('アルバム削除', '削除しますか？', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              // deleteAlbum(user.id, viewAlbum);
            },
          },
        ]);
      }}
    />
  );
};
