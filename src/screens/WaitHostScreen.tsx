import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
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
import {
  getGroupUserCollection,
  getGroupRef,
  saveNotifications,
  getGroupAlbumCollection,
} from '../lib/firebase';
/* components */
import { WalkthroughModal } from '../components/WalkthroughModal';
import { Loading } from '../components/Loading';
import { StartModal } from '../components/StartModal';
/* contexts */
import { AlbumContext } from '../contexts/AlbumContext';
import { AlbumsContext } from '../contexts/AlbumsContext';
import { CountContext } from '../contexts/CountContext';
import { UserContext } from '../contexts/UserContext';
import { GroupContext } from '../contexts/GroupContext';
import { VisibleWalkthroughContext } from '../contexts/VisibleWalkthroughContext';
/* types */
import { Album } from '../types/album';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'WaitHost'>;
};

// アプリがフォアグラウンドの時に通知を受信した時の振る舞いを設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const WaitHostScreen: React.FC<Props> = ({ navigation }: Props) => {
  const { user } = useContext(UserContext);
  const { group } = useContext(GroupContext);
  const { albums, setAlbums } = useContext(AlbumsContext);
  const { setAlbum } = useContext(AlbumContext);
  const { visibleWalkthrough, setVisibleWalkthrough } = useContext(
    VisibleWalkthroughContext
  );
  const { setCount } = useContext(CountContext);
  const [groupUsers, setGroupUsers] = useState<
    firebase.firestore.DocumentData[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleStart, setVisibleStart] = useState<boolean>(false);

  // get permission
  useEffect(() => {
    requestPermissionsAsync();
    const userUnsubscribe = getGroupUserCollection(group.id).onSnapshot(
      (snap) => {
        const users = snap.docs.map((doc) => doc.data());
        setGroupUsers(users);
      }
    );
    const groupUnsubscribe = getGroupRef(group.id).onSnapshot((snap) => {
      const status = snap.data().status;
      if (status === 'doing') {
        onStart();
      }
    });
    return () => {
      groupUnsubscribe();
      userUnsubscribe();
    };
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

  const dismissWalkthroughModal = async () => {
    setVisibleWalkthrough(false);
  };

  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  const getGroupAlbumContext = async () => {
    // create album reference
    const groupAlbumCollection = await getGroupAlbumCollection(group.id);
    const d = groupAlbumCollection.docs[0].data();
    const album = {
      id: d.id,
      userId: user.id,
      groupId: group.id,
      // ベタがき・将来的になくす
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/hinome-app-dev.appspot.com/o/public%2Fphoto.png?alt=media&token=76cbb9d2-dd1a-438b-8006-d76c5da1d186',
      createdAt: d.createdAt,
      startAt: d.startAt,
      endAt: d.endAt,
    } as Album;
    setAlbum(album);
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
    const { id, startAt, endAt } = await getGroupAlbumContext();
    try {
      await AsyncStorage.setItem('@albumId', id);
    } catch (e) {
      console.log(e);
    }
    const notifyCount = 10;
    const offset = 120;
    const notifyAts = createNotifyAts(startAt, endAt, notifyCount, offset);
    await saveNotifications(id, user.id, notifyAts);
    for (const notifyAt of notifyAts) {
      scheduleNotificationAsync(notifyAt);
    }
    setLoading(false);
    setVisibleStart(true);
  };

  const checkLeftNotificatonCountAsync = async () => {
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync();
    setCount(notifications.length);
  };

  const dismissStartModal = async () => {
    await checkLeftNotificatonCountAsync();
    setVisibleStart(false);
    navigation.popToTop();
  };

  const renderItem = ({ item }) => (
    <Text style={styles.startText}>{item.name}</Text>
  );

  // アルバムオブジェクトの有無で日の目画面を変更する
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
      style={styles.viewLinearGradient}
    >
      <SafeAreaView style={styles.container}>
        <WalkthroughModal
          visible={visibleWalkthrough}
          dismissModal={dismissWalkthroughModal}
        />
        <StartModal visible={visibleStart} dismissModal={dismissStartModal} />
        <View style={styles.startContainer}>
          <Text style={styles.nextButtonText}>ホストの開始待ち</Text>
          <Text style={styles.startText}>メンバー</Text>
          <FlatList
            data={groupUsers}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </SafeAreaView>
      <Loading visible={loading} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  viewLinearGradient: {
    flex: 1,
  },
  startContainer: {
    marginTop: 40,
  },
  settingContainer: {
    top: '50%',
  },
  startText: {
    color: 'white',
    fontSize: 25,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontFamily: 'MPLUS1p_400Regular',
    textAlign: 'center',
    backgroundColor: 'transparent',
    marginTop: 20,
    marginBottom: 20,
  },
  nextButtonText: {
    color: 'rgb(217, 103, 110)',
    fontSize: 30,
    fontFamily: 'MPLUS1p_400Regular',
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
