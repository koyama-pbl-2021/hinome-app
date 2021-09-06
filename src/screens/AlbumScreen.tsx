import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import {
  Alert,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
  StatusBar,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import { LinearGradient } from 'expo-linear-gradient';
/* components */
import { PhotoItem } from '../components/PhotoItem';
import { GarbageButton } from '../components/GarbageButton';
import { CameraModal } from '../components/CameraModal';
/* contexts */
import { UserContext } from '../contexts/UserContext';
import { VisibleCameraContext } from '../contexts/VisibleCameraContext';
/* lib */
import { getPhotos, getAlbumRef } from '../lib/firebase';
/* types */
import { Photo } from '../types/photo';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import SwipeView from 'react-native-swipeview';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Album'>;
  route: RouteProp<RootStackParamList, 'Album'>;
};

export const AlbumScreen: React.FC<Props> = ({ navigation, route }: Props) => {
  const { album } = route.params;
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [visible, setIsVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const { user } = useContext(UserContext);
  const { visibleCamera, setVisibleCamera } = useContext(VisibleCameraContext);
  const images = photos.map((photo) => {
    return {
      uri: photo.imageUrl,
    };
  });

  useEffect(() => {
    getFirebaseItems();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <GarbageButton onPress={onPressGarbageButton} />,
    });
  }, [navigation]);

  const getFirebaseItems = async () => {
    const photos = await getPhotos(album.id, user.id);
    setPhotos(photos);
  };

  const deleteAlbum = async () => {
    const albumRef = await getAlbumRef(user.id, album.id);
    // albumRef.delete();
    navigation.goBack();
  };

  const onPressPhoto = (index: number) => {
    setIndex(index);
    setIsVisible(true);
  };

  const dismissCameraModal = async () => {
    setVisibleCamera(false);
  };

  const onPressGarbageButton = () => {
    Alert.alert('アルバム削除', '削除しますか？', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => deleteAlbum(),
      },
    ]);
  };

  return (
    <LinearGradient
      start={{
        x: 0.31,
        y: 1.1,
      }}
      end={{
        x: 0.69,
        y: -0.1,
      }}
      locations={[0, 1]}
      colors={['rgb(247, 132, 98)', 'rgb(139, 27, 140)']}
      style={styles.linearGradient}
    >
      <SafeAreaView style={styles.container}>
        <CameraModal
          visible={visibleCamera}
          dismissModal={dismissCameraModal}
        />
        <ImageView
          images={images}
          imageIndex={index}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
        <FlatList
          style={styles.itemContainer}
          data={photos}
          renderItem={({ item, index }: { item: Photo; index: number }) => (
            <PhotoItem photo={item} onPress={() => onPressPhoto(index)} />
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  itemContainer: {
    marginTop: 40,
  },
});
