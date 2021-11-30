import React, { useEffect, useContext } from 'react';
import {
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
import firebase from 'firebase';
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
} from '../lib/firebase';
/* types */
import { Album } from '../types/album';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
/* utils */
import { isRecent } from '../utils/notification';

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
  const isFocused = useIsFocused();

  useEffect(() => {
    getFirebaseItems();
    // 日の目開始情報
    getAlbumFromLocalStorage();
    // Walkthroughモーダル
    getWalkthroughFromLocalStorage();
    // 通知時間情報の取得
    getLatestNotificationTime();
  }, []);

  useEffect(() => {
    // 日の目が開始状態であれば通知情報をpull
    if (album) {
      const f = async () => {
        const notifications = await getNotifications(album.id, user.id);
        setVisibleCamera(isRecent(notifications, 3));
        console.log(isRecent(notifications, 3));
      };
      f();
    } else {
      setVisibleCamera(false);
    }
  }, [isFocused]);

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

  const getLatestNotificationTime = async () => {
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync();
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

  const onPressAlbum = (currentAlbum: Album) => {
    navigation.navigate('Album', { currentAlbum });
  };

  const onPressCamera = () => {
    navigation.navigate('Camera');
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
            onPress={() => onPressCamera()}
          />
        </View>
      ) : (
        <View style={styles.footer}>
          <MaterialCommunityIcons
            name="camera-off"
            size={50}
            color={'black'}
            onPress={() => {}}
          />
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
