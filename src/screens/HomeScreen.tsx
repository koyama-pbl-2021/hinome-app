import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
  StatusBar,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
/* components */
import { AlbumItem } from '../components/AlbumItem';
import { WalkthroughModal } from '../components/WalkthroughModal';
import { CameraModal } from '../components/CameraModal';
import { FinishModal } from '../components/FinishModal';
/* contexts */
import { AlbumContext } from '../contexts/AlbumContext';
import { AlbumsContext } from '../contexts/AlbumsContext';
import { CountContext } from '../contexts/CountContext';
import { UserContext } from '../contexts/UserContext';
import { VisibleWalkthroughContext } from '../contexts/VisibleWalkthroughContext';
import { VisibleCameraContext } from '../contexts/VisibleCameraContext';
/* lib */
import { getAlbum, getAlbums } from '../lib/firebase';
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
  const { album, setAlbum } = useContext(AlbumContext);
  const { albums, setAlbums } = useContext(AlbumsContext);
  const { user } = useContext(UserContext);
  const [visibleFinish, setVisibleFinish] = useState<boolean>(false);
  const { count, setCount } = useContext(CountContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    getFirebaseItems();
    // 日の目開始情報
    getAlbumFromLocalStorage();
    // Walkthroughモーダル
    getWalkthroughFromLocalStorage();
  }, []);

  useEffect(() => {
    checkLeftNotificatonCountAsync();
  }, [isFocused]);

  const getFirebaseItems = async () => {
    const albums = await getAlbums(user.id);
    setAlbums(albums);
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

  const dismissFinishModal = async () => {
    // 日の目開始情報
    setAlbum(null);
    setVisibleFinish(false);
  };

  const onPressAlbum = (album: Album) => {
    navigation.navigate('Album', { album });
  };

  const checkLeftNotificatonCountAsync = async () => {
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync();
    setCount(notifications.length);
    console.log(notifications.length);
    if (notifications.length === 0 && album) {
      // モーダルを表示させる
      setVisibleFinish(true);
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
        <FinishModal
          visible={visibleFinish}
          dismissModal={dismissFinishModal}
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
              <AlbumItem album={item} onPress={() => onPressAlbum(item)} />
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
