import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import firebase from 'firebase';
/* lib */
import { createAlbumRef } from '../lib/firebase';
/* components */
import { Loading } from '../components/Loading';
import { WalkthroughModal } from '../components/WalkthroughModal';
/* contexts */
import { AlbumsContext } from '../contexts/AlbumsContext';
import { AlbumContext } from '../contexts/AlbumContext';
import { UserContext } from '../contexts/UserContext';
import { VisibleWalkthroughContext } from '../contexts/VisibleWalkthroughContext';
/* types */
import { Album } from '../types/album';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'HinomeStart'>;
  route: RouteProp<RootStackParamList, 'HinomeStart'>;
};

// アプリがフォアグラウンドの時に通知を受信した時の振る舞いを設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const HinomeStartScreen: React.FC<Props> = ({
  navigation,
  route,
}: Props) => {
  const { hour } = route.params;
  const [loading, setLoading] = useState<boolean>(false);
  const { albums, setAlbums } = useContext(AlbumsContext);
  const { setAlbum } = useContext(AlbumContext);
  const { user } = useContext(UserContext);
  const { visibleWalkthrough, setVisibleWalkthrough } = useContext(
    VisibleWalkthroughContext
  );

  // get permission
  useEffect(() => {
    requestPermissionsAsync();
    Notifications.addNotificationResponseReceivedListener(() => {
      navigation.navigate('Camera');
    });
  }, []);

  const requestPermissionsAsync = async () => {
    const { granted } = await Notifications.getPermissionsAsync();
    if (granted) {
      return;
    }
    await Notifications.requestPermissionsAsync();
  };

  const scheduleNotificationAsync = async (
    notifyAt: firebase.firestore.Timestamp
  ) => {
    const date = notifyAt.toDate();
    await Notifications.scheduleNotificationAsync({
      content: {
        body: 'さあ撮りましょう！タッチしてください',
      },
      trigger: date,
    });
  };

  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  const createAlbumContext = async () => {
    // create album reference
    const albumDocRef = await createAlbumRef(user.id);
    // create hinome endTime
    const dt = new Date();
    dt.setHours(dt.getHours() + Number(hour));
    const album = {
      id: albumDocRef.id,
      userId: user.id,
      groupId: '', // 未実装なのでとりあえず空
      // ベタがき・将来的になくす
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/hinome-app-dev.appspot.com/o/public%2Falbum-init.png?alt=media&token=5175414d-84dc-43bc-b846-b75aa783c3fb',
      createdAt: firebase.firestore.Timestamp.now(),
      startAt: firebase.firestore.Timestamp.now(),
      endAt: firebase.firestore.Timestamp.fromDate(dt),
    } as Album;
    // create document
    await albumDocRef.set(album);
    // store context
    setAlbum(album);
    // ホーム画面への即時反映のため
    setAlbums([album, ...albums]);
    return album;
  };

  const createNotifyAts = (
    startAt: firebase.firestore.Timestamp,
    endAt: firebase.firestore.Timestamp,
    notifyCount: number,
    offset: number
  ) => {
    const notifyAts = [];
    const nanoSeconds = startAt.nanoseconds;
    // 乱数生成の範囲
    const range = endAt.seconds - startAt.seconds;
    for (let i = 0; i < notifyCount; i++) {
      const seconds = getRandomInt(range) + startAt.seconds;
      const notifyAt = new firebase.firestore.Timestamp(
        offset + seconds,
        nanoSeconds
      );
      notifyAts.push(notifyAt);
    }
    return notifyAts;
  };

  const onStart = async () => {
    setLoading(true);
    const { id, startAt, endAt } = await createAlbumContext();
    try {
      await AsyncStorage.setItem('@albumId', id);
    } catch (e) {
      console.log(e);
    }
    const notifyCount = 10;
    const offset = 120;
    const notifyAts = createNotifyAts(startAt, endAt, notifyCount, offset);
    for (const notifyAt of notifyAts) {
      scheduleNotificationAsync(notifyAt);
    }
    setLoading(false);
    navigation.pop();
  };

  const onBack = () => {
    navigation.pop();
  };

  const dismissModal = async () => {
    setVisibleWalkthrough(false);
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
          dismissModal={dismissModal}
        />
        <View style={styles.startContainer}>
          <Text style={styles.startText}>
            {hour}時間の間に撮影タイミングを{'\n'}10回通知します
          </Text>
          <TouchableOpacity onPress={onStart} style={styles.startButton}>
            <Text style={styles.startButtonText}>開始</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onBack} style={styles.startButton}>
            <Text style={styles.startButtonText}>戻る</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <Loading visible={loading} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  loginViewLinearGradient: {
    flex: 1,
  },
  startContainer: {
    marginTop: 40,
  },
  startText: {
    color: 'white',
    fontSize: 30,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    backgroundColor: 'transparent',
    marginTop: 50,
    marginBottom: 50,
  },
  startButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 00.20)',
    shadowRadius: 25,
    shadowOpacity: 1,
    justifyContent: 'center',
    padding: 0,
    height: 60,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },
  startButtonText: {
    color: 'rgb(217, 103, 110)',
    fontSize: 30,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
