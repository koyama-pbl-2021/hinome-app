import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import firebase from 'firebase';
/* lib */
import { createAlbumRef } from '../lib/firebase';
/* contexts */
import { AlbumContext } from '../contexts/AlbumContext';
import { UserContext } from '../contexts/UserContext';
/* types */
import { Album } from '../types/album';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'HinomeStart'>;
  route: RouteProp<RootStackParamList, 'HinomeStart'>;
};

export const HinomeStartScreen: React.FC<Props> = ({
  navigation,
  route,
}: Props) => {
  const { hour } = route.params;
  // for set album context
  const { setAlbum } = useContext(AlbumContext);
  const { user } = useContext(UserContext);
  const createAlbumContext = async () => {
    // create album reference
    const albumDocRef = await createAlbumRef();
    // create hinome endTime
    const dt = new Date();
    dt.setHours(dt.getHours() + Number(hour));
    const album = {
      id: albumDocRef.id,
      userId: user.id,
      groupId: '', // 未実装なのでとりあえず空
      // ベタがき・将来的になくす
      imageUrl:
        'https://placehold.jp/d1422c/455a91/150x150.png?text=%E3%82%A2%E3%83%AB%E3%83%90%E3%83%A05',
      createdAt: firebase.firestore.Timestamp.now(),
      startAt: firebase.firestore.Timestamp.now(),
      endAt: firebase.firestore.Timestamp.fromDate(dt),
    } as Album;
    // create document
    await albumDocRef.set(album);
    // store context
    setAlbum(album);
  };

  const onStart = () => {
    createAlbumContext();
    console.log(firebase.firestore.Timestamp.now());
    navigation.pop();
  };

  const onBack = () => {
    navigation.pop();
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
      <SafeAreaView>
        <Text style={styles.welcomeBackText}>{hour}時間で日の目します</Text>
        <TouchableOpacity onPress={onStart} style={styles.startButton}>
          <Text style={styles.startButtonText}>開始</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack} style={styles.startButton}>
          <Text style={styles.startButtonText}>戻る</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  loginViewLinearGradient: {
    flex: 1,
  },
  welcomeBackText: {
    color: 'white',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    backgroundColor: 'transparent',
    marginTop: 20,
  },
  startButton: {
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
  startButtonText: {
    color: 'rgb(217, 103, 110)',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
});
