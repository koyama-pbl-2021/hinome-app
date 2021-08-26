import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  StatusBar,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Platform,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
/* components */
import { CameraModal } from '../components/CameraModal';
import { HourButton } from '../components/HourButton';
import { WalkthroughModal } from '../components/WalkthroughModal';
import { FinishModal } from '../components/FinishModal';
/* contexts */
import { AlbumContext } from '../contexts/AlbumContext';
import { CountContext } from '../contexts/CountContext';
import { VisibleWalkthroughContext } from '../contexts/VisibleWalkthroughContext';
import { VisibleCameraContext } from '../contexts/VisibleCameraContext';
/* types */
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Hinome'>;
};

export const HinomeScreen: React.FC<Props> = ({ navigation }: Props) => {
  // Contextからalbumオブジェクトを取得
  const { album, setAlbum } = useContext(AlbumContext);
  const { visibleCamera, setVisibleCamera } = useContext(VisibleCameraContext);
  const { visibleWalkthrough, setVisibleWalkthrough } = useContext(
    VisibleWalkthroughContext
  );
  const [hours] = useState<string[]>(['1', '2', '4', '8', '12', '24']);
  const { count, setCount } = useContext(CountContext);
  const [visibleFinish, setVisibleFinish] = useState<boolean>(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    checkLeftNotificatonCountAsync();
  }, [isFocused]);

  const onPressHour = (hour: string) => {
    navigation.navigate('HinomeStart', { hour });
  };

  const onStop = async () => {
    setAlbum(null);
    setVisibleFinish(false);
    try {
      await AsyncStorage.removeItem('@albumId');
    } catch (e) {
      console.log(e);
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  const timeFormat = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${month}月${day}日${hours}時${minutes}分`;
  };

  const dismissWalkthroughModal = async () => {
    setVisibleWalkthrough(false);
  };

  const dismissCameraModal = async () => {
    // この画面でカメラが開いても再レンダリングされないため、カメラモーダルクローズ時にstateを変更させる
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync();
    setCount(notifications.length);
    setVisibleCamera(false);
  };

  const dismissFinishModal = async () => {
    // アルバムオブジェクトはここで消させる
    setAlbum(null);
    setVisibleFinish(false);
    try {
      await AsyncStorage.removeItem('@albumId');
    } catch (e) {
      console.log(e);
    }
  };

  const checkLeftNotificatonCountAsync = async () => {
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync();
    setCount(notifications.length);
    if (notifications.length === 0 && album) {
      setVisibleFinish(true);
    }
  };
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
      style={styles.loginViewLinearGradient}
    >
      <SafeAreaView style={styles.container}>
        <CameraModal
          visible={visibleCamera}
          dismissModal={dismissCameraModal}
        />
        <WalkthroughModal
          visible={visibleWalkthrough}
          dismissModal={dismissWalkthroughModal}
        />
        <FinishModal
          visible={visibleFinish}
          dismissModal={dismissFinishModal}
        />
        {!album ? (
          <FlatList
            style={styles.itemContainer}
            data={hours}
            renderItem={({ item }: { item: string }) => (
              <HourButton hour={item} onPress={() => onPressHour(item)} />
            )}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
        ) : (
          <View style={styles.settingContainer}>
            <Text style={styles.timeText}>
              開始：{timeFormat(album.startAt.toDate())}
            </Text>
            <Text style={styles.timeText}>
              終了：{timeFormat(album.endAt.toDate())}
            </Text>
            <Text style={styles.timeText}>通知は残り{count}回</Text>
            <TouchableOpacity onPress={onStop} style={styles.stopButton}>
              <Text style={styles.stopButtonText}>中止</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  itemContainer: {
    marginTop: 40,
  },
  settingContainer: {
    top: '50%',
  },
  loginViewLinearGradient: {
    flex: 1,
  },
  stopButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 00.20)',
    shadowRadius: 25,
    shadowOpacity: 1,
    justifyContent: 'center',
    padding: 0,
    alignSelf: 'stretch',
    height: 60,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    marginTop: 200,
  },
  stopButtonText: {
    color: 'rgb(217, 103, 110)',
    fontSize: 30,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  timeText: {
    color: '#fff',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: 10,
  },
});
