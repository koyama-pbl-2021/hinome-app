import React, { useEffect, useState, useContext } from 'react';

import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
  StatusBar,
  Text,
  Alert,
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
/* components */
import { AlbumItem } from '../components/AlbumItem';
import { WalkthroughModal } from '../components/WalkthroughModal';
import { CameraModal } from '../components/CameraModal';

/* contexts */
import { AlbumContext } from '../contexts/AlbumContext';
import { AlbumsContext } from '../contexts/AlbumsContext';
import { UserContext } from '../contexts/UserContext';
import { ViewAlbumContext } from '../contexts/ViewAlbumContext';
import { VisibleWalkthroughContext } from '../contexts/VisibleWalkthroughContext';
import { VisibleCameraContext } from '../contexts/VisibleCameraContext';
/* lib */
import { getAlbum, getAlbums, getAlbumRef } from '../lib/firebase';

/* types */
import { Album } from '../types/album';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<Props> = ({ navigation }: Props) => {
  const { visibleWalkthrough, setVisibleWalkthrough } = useContext(
    VisibleWalkthroughContext
  );
  const { visibleCamera, setVisibleCamera } = useContext(VisibleCameraContext);
  const { setAlbum } = useContext(AlbumContext);
  const { viewAlbum, setViewAlbum } = useContext(ViewAlbumContext);

  const { albums, setAlbums } = useContext(AlbumsContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    getFirebaseItems();
    // 日の目開始情報
    getAlbumFromLocalStorage();
    // Walkthroughモーダル
    getWalkthroughFromLocalStorage();
  }, []);

  const getFirebaseItems = async () => {
    const albums = await getAlbums(user.id);
    setAlbums(albums);
  };

  const deleteAlbum = async (userId: string, albumId: string) => {
    const albumRef = await getAlbumRef(userId, albumId);
    await albumRef.delete();
    getFirebaseItems();
  };

  const getAlbumFromLocalStorage = async () => {
    try {
      const albumId = await AsyncStorage.getItem('@albumId');
      if (albumId) {
        const album = await getAlbum(user.id, albumId);
        setAlbum(album);
      } else {
        setAlbum(null);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Home画面のみ実装
  const getWalkthroughFromLocalStorage = async () => {
    try {
      const invisible = await AsyncStorage.getItem('@invisibleWalkthrough');
      // AsyncStorageはstringのみしか入れられない
      if (!invisible) {
        setVisibleWalkthrough(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const dismissWalkthroughModal = async () => {
    setVisibleWalkthrough(false);
    // 初回起動はHome画面なのでAsyncStorageへ格納
    try {
      await AsyncStorage.setItem('@invisibleWalkthrough', 'true');
    } catch (e) {
      console.log(e);
    }
  };

  const dismissCameraModal = async () => {
    setVisibleCamera(false);
  };

  const onPressAlbum = (album: Album) => {
    navigation.navigate('Album', { album });
    //ß setViewAlbum();
  };

  let swipeBtns = (id) => [
    {
      text: 'Delete',
      backgroundColor: 'red',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: () => {
        console.log(id);
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
              deleteAlbum(user.id, id);
            },
          },
        ]);
      },
    },
  ];

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
      style={styles.loginViewLinearGradient}
    >
      <SafeAreaView style={styles.container}>
        <WalkthroughModal
          visible={visibleWalkthrough}
          dismissModal={dismissWalkthroughModal}
        />
        <CameraModal
          visible={visibleCamera}
          dismissModal={dismissCameraModal}
        />
        {albums.length === 0 ? (
          <Text style={styles.noAlbumText}>
            中央のタブから開始すると{'\n'}アルバムが表示されます
          </Text>
        ) : (
          <FlatList
            style={styles.itemContainer}
            data={albums}
            renderItem={({ item }: { item: Album }) => (
              <Swipeout
                right={swipeBtns(item.id)}
                backgroundColor="transparent"
              >
                <AlbumItem album={item} onPress={() => onPressAlbum(item)} />
              </Swipeout>
            )}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  loginViewLinearGradient: {
    flex: 1,
  },
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  itemContainer: {
    marginTop: 40,
  },
  noAlbumText: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 25,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    marginTop: 120,
    marginBottom: 0,
    marginRight: 20,
    marginLeft: 20,
  },
});
