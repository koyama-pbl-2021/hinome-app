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
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
/* components */
import { PhotoItem } from '../components/PhotoItem';
import { GarbageButton } from '../components/GarbageButton';
import { CameraModal } from '../components/CameraModal';
/* contexts */
import { AlbumContext } from '../contexts/AlbumContext';
import { AlbumsContext } from '../contexts/AlbumsContext';
import { UserContext } from '../contexts/UserContext';
import { VisibleCameraContext } from '../contexts/VisibleCameraContext';
/* lib */
import { getPhotos, getAlbumRef } from '../lib/firebase';
/* types */
import { Photo } from '../types/photo';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Album'>;
  route: RouteProp<RootStackParamList, 'Album'>;
};

export const AlbumScreen: React.FC<Props> = ({ navigation, route }: Props) => {
  const { currentAlbum } = route.params;
  const { album, setAlbum } = useContext(AlbumContext);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [visible, setIsVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const { albums, setAlbums } = useContext(AlbumsContext);
  const { user } = useContext(UserContext);
  const { visibleCamera, setVisibleCamera } = useContext(VisibleCameraContext);
  const images = photos.map((photo) => {
    return {
      uri: photo.imageUrl,
    };
  });

  useEffect(() => {
    console.log(currentAlbum);
    getFirebaseItems();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <GarbageButton onPress={onPressGarbageButton} />,
    });
  }, [navigation]);

  const getFirebaseItems = async () => {
    const photos = await getPhotos(currentAlbum.id, user.id);
    setPhotos(photos);
  };

  const cancelNotify = async () => {
    try {
      await AsyncStorage.removeItem('@albumId');
    } catch (e) {
      console.log(e);
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  const deleteAlbum = async () => {
    const albumRef = await getAlbumRef(user.id, currentAlbum.id);
    // albums contextを更新するための処理
    const newAlbums = albums.filter((obj) => {
      return obj.id !== currentAlbum.id;
    });
    setAlbums(newAlbums);
    albumRef.delete();
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
    if (currentAlbum.id == album?.id) {
      Alert.alert(
        'アルバム削除',
        '削除するとアルバム作成も中断しますが良いですが？',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              console.log(user);
              setAlbum(null);
              deleteAlbum();
              cancelNotify();
            },
          },
        ]
      );
    } else {
      Alert.alert('アルバム削除', '削除しますか？', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            console.log(user);
            deleteAlbum();
          },
        },
      ]);
    }
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
