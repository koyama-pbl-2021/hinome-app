import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  StatusBar,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
/* components */
import { HourButton } from '../components/HourButton';
/* contexts */
import { AlbumContext } from '../contexts/AlbumContext';
/* types */
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export const HinomeScreen: React.FC<Props> = ({ navigation }: Props) => {
  // Contextからalbumオブジェクトを取得
  const { album, setAlbum } = useContext(AlbumContext);
  const [hours] = useState<string[]>(['1', '2', '4', '8', '12', '24']);
  const onPressHour = (hour: string) => {
    navigation.navigate('HinomeStart', { hour });
  };

  const onStop = () => {
    setAlbum(null);
    // firebaseの通知コレクションを消しに行く処理
  };

  const timeFormat = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${month}月${day}日${hours}時${minutes}分`;
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
      {!album ? (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={hours}
            renderItem={({ item }: { item: string }) => (
              <HourButton hour={item} onPress={() => onPressHour(item)} />
            )}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.container}>
          <Text style={styles.timeText}>
            開始：{timeFormat(album.startAt.toDate())}
          </Text>
          <Text style={styles.timeText}>
            終了：{timeFormat(album.endAt.toDate())}
          </Text>
          <TouchableOpacity onPress={onStop} style={styles.stopButton}>
            <Text style={styles.stopButtonText}>中止</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  loginViewLinearGradient: {
    flex: 1,
  },
  stopButton: {
    backgroundColor: 'white',
    borderRadius: 2,
    shadowColor: 'rgba(0, 0, 0, 00.20)',
    shadowRadius: 25,
    shadowOpacity: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    alignSelf: 'stretch',
    height: 60,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 11,
  },
  stopButtonText: {
    color: 'rgb(217, 103, 110)',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  timeText: {
    color: '#000000',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
