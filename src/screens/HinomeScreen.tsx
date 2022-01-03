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
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
/* components */
import { FinishModal } from '../components/FinishModal';
import { WalkthroughModal } from '../components/WalkthroughModal';
/* contexts */
import { AlbumContext } from '../contexts/AlbumContext';
import { CountContext } from '../contexts/CountContext';
import { UserContext } from '../contexts/UserContext';
import { VisibleWalkthroughContext } from '../contexts/VisibleWalkthroughContext';
/* types */
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
/* utils */
import { timeFormat } from '../utils/time';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Hinome'>;
};

export const HinomeScreen: React.FC<Props> = ({ navigation }: Props) => {
  const { user } = useContext(UserContext);
  const { album, setAlbum } = useContext(AlbumContext);
  const { count, setCount } = useContext(CountContext);
  const [visibleFinish, setVisibleFinish] = useState<boolean>(false);
  const { visibleWalkthrough, setVisibleWalkthrough } = useContext(
    VisibleWalkthroughContext
  );
  const isFocused = useIsFocused();

  useEffect(() => {
    checkLeftNotificatonCountAsync();
  }, [isFocused]);

  const onSingleStart = async () => {
    navigation.navigate('TimeSelect');
  };

  const onMultipleStart = async () => {
    navigation.navigate('MultipleStart');
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

  const checkLeftNotificatonCountAsync = async () => {
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync();
    setCount(notifications.length);
    if (notifications.length === 0 && album) {
      setVisibleFinish(true);
    }
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

  const dismissWalkthroughModal = async () => {
    setVisibleWalkthrough(false);
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
      style={styles.viewLinearGradient}
    >
      <SafeAreaView style={styles.container}>
        <WalkthroughModal
          visible={visibleWalkthrough}
          dismissModal={dismissWalkthroughModal}
        />
        <FinishModal
          visible={visibleFinish}
          dismissModal={dismissFinishModal}
        />
        {!album ? (
          <View style={styles.startContainer}>
            <TouchableOpacity
              onPress={onSingleStart}
              style={styles.startButton}
            >
              <Text style={styles.startButtonText}>ひとりで</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onMultipleStart}
              style={styles.startButton}
            >
              <Text style={styles.startButtonText}>みんなで</Text>
            </TouchableOpacity>
          </View>
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
  viewLinearGradient: {
    flex: 1,
  },
  startContainer: {
    marginTop: 40,
  },
  settingContainer: {
    top: '50%',
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
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 20,
  },
  startButtonText: {
    color: 'rgb(217, 103, 110)',
    fontSize: 30,
    fontFamily: 'MPLUS1p_400Regular',
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  stopButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 00.20)',
    shadowRadius: 25,
    shadowOpacity: 1,
    justifyContent: 'center',
    padding: 0,
    height: 60,
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 20,
    marginTop: 200,
  },
  stopButtonText: {
    color: 'rgb(217, 103, 110)',
    fontSize: 30,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontFamily: 'MPLUS1p_400Regular',
    textAlign: 'center',
  },
  timeText: {
    color: '#fff',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontFamily: 'MPLUS1p_400Regular',
    textAlign: 'center',
    marginBottom: 10,
  },
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
