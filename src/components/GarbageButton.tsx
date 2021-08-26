import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  onPress: () => void;
};

import { ViewAlbumContext } from '../contexts/ViewAlbumContext';

const deleteAlbum = async (albumId: string) => {
  const albumRef = await deleteAlbumRef(albumId);
  await albumRef.delete({
    albumId: albumId,
  });
};
export const GarbageButton: React.FC = () => {
  const { setViewAlbum } = useContext(ViewAlbumContext);

  return (
    <MaterialIcons
      name="delete"
      size={24}
      color="black"
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
              setViewAlbum(null);
            },
          },
        ]);
      }}
    />
  );
};
