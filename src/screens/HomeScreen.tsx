import React, { useEffect, useContext, useState } from 'react';
import {
  AppState,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
/* components */
import { AlbumItem } from '../components/AlbumItem';
import { WalkthroughModal } from '../components/WalkthroughModal';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
/* contexts */
import { AlbumContext } from '../contexts/AlbumContext';
import { AlbumsContext } from '../contexts/AlbumsContext';
import { UserContext } from '../contexts/UserContext';
import { VisibleWalkthroughContext } from '../contexts/VisibleWalkthroughContext';
import { VisibleCameraContext } from '../contexts/VisibleCameraContext';
/* lib */
import {
  getAlbum,
  getAlbums,
  getAlbumRef,
  getNotifications,
  getUserRef,
} from '../lib/firebase';
/* types */
import { Album } from '../types/album';
import { Notification } from '../types/notification';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
/* utils */
import { getCurrentNotification } from '../utils/notification';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<Props> = ({ navigation }: Props) => {
  const { visibleCamera, setVisibleCamera } = useContext(VisibleCameraContext);
  const { visibleWalkthrough, setVisibleWalkthrough } = useContext(
    VisibleWalkthroughContext
  );
  const { album, setAlbum } = useContext(AlbumContext);
  const { albums, setAlbums } = useContext(AlbumsContext);
  const { user } = useContext(UserContext);
  const [currentNotification, setCurrentNotification] =
    useState<Notification | null>();
  const isFocused = useIsFocused();

  useEffect(() => {
    getFirebaseItems();
    // 日の目開始情報
    getAlbumFromLocalStorage();
    // Walkthroughモーダル
    setWalkthroughModal();
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    // 日の目が開始状態であれば通知情報をpull
    if (album) {
      activeCameraButton(album);
    } else {
      setVisibleCamera(false);
    }
  }, [isFocused]);

  const handleAppStateChange = (nextAppState: any) => {
    // foregroundになったとき
    if (nextAppState === 'active') {
      if (album) {
        activeCameraButton(album);
      } else {
        setVisibleCamera(false);
      }
    }
  };

  const activeCameraButton = async (album: Album) => {
    const notifications = await getNotifications(album.id, user.id);
    // 直近3分の通知があった場合notificationに値が入る
    const notification = getCurrentNotification(notifications, 3);
    // 直近3分の通知があった場合、カメラボタンを有効化する
    if (notification) {
      setVisibleCamera(true);
      setCurrentNotification(notification);
    } else {
      setVisibleCamera(false);
    }
  };

  const getFirebaseItems = async () => {
    const albums = await getAlbums(user.id);
    setAlbums(albums);
  };

  const deleteAlbum = async (userId: string, albumId: string) => {
    const albumRef = await getAlbumRef(userId, albumId);
    // albums contextを更新するための処理
    const newAlbums = albums.filter((obj) => {
      return obj.id !== albumId;
    });
    setAlbums(newAlbums);
    await albumRef.delete();
  };

  const cancelNotify = async () => {
    try {
      await AsyncStorage.removeItem('@albumId');
    } catch (e) {
      console.log(e);
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
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
  const setWalkthroughModal = async () => {
    if (user.isFirst) {
      setVisibleWalkthrough(true);
    }
  };

  const dismissWalkthroughModal = async () => {
    setVisibleWalkthrough(false);
    const userRef = await getUserRef(user.id);
    await userRef.update({
      isFirst: false,
    });
  };

  const onPressAlbum = (currentAlbum: Album) => {
    navigation.navigate('Album', { currentAlbum });
  };

  const onPressCamera = (currentNotification: Notification) => {
    navigation.navigate('Camera', { currentNotification });
  };

  const rightButton = (albumId: string) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
        onPress={() => onPressSwipeButton(albumId)}
      >
        <View>
          <Text
            style={{
              color: '#1b1a17',
              paddingHorizontal: 10,
              fontWeight: '600',
              paddingVertical: 20,
            }}
          >
            Delete
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onPressSwipeButton = (albumId: string) => {
    if (albumId == album?.id) {
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
              setAlbum(null);
              deleteAlbum(user.id, albumId);
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
            deleteAlbum(user.id, albumId);
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
      style={styles.loginViewLinearGradient}
    >
      <SafeAreaView style={styles.container}>
        <WalkthroughModal
          visible={visibleWalkthrough}
          dismissModal={dismissWalkthroughModal}
        />
        {albums.length === 0 ? (
          <Text style={styles.noAlbumText}>
            Hinomeタブから開始すると{'\n'}アルバムが表示されます
          </Text>
        ) : (
          <FlatList
            style={styles.itemContainer}
            data={albums}
            renderItem={({ item }: { item: Album }) => (
              <Swipeable renderRightActions={() => rightButton(item.id)}>
                <AlbumItem album={item} onPress={() => onPressAlbum(item)} />
              </Swipeable>
            )}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
        )}
      </SafeAreaView>
      {visibleCamera ? (
        <View style={styles.footer}>
          <MaterialIcons
            name="photo-camera"
            size={50}
            color={'black'}
            onPress={() => onPressCamera(currentNotification)}
          />
        </View>
      ) : (
        <View style={styles.footer}>
          <MaterialCommunityIcons name="camera-off" size={50} color={'black'} />
        </View>
      )}
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
  footer: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'white',
    borderRadius: 50,
    margin: 10,
    padding: 10,
    right: 0,
  },
});
