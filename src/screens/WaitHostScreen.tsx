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
import * as Notifications from 'expo-notifications';
import firebase from 'firebase';
/* lib */
import { getGroupUserCollection } from '../lib/firebase';
/* components */
import { WalkthroughModal } from '../components/WalkthroughModal';
/* contexts */
import { UserContext } from '../contexts/UserContext';
import { GroupContext } from '../contexts/GroupContext';
import { VisibleWalkthroughContext } from '../contexts/VisibleWalkthroughContext';
/* types */
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'WaitHost'>;
};

export const WaitHostScreen: React.FC<Props> = ({ navigation }: Props) => {
  const { user } = useContext(UserContext);
  const { group } = useContext(GroupContext);
  const { visibleWalkthrough, setVisibleWalkthrough } = useContext(
    VisibleWalkthroughContext
  );
  const [groupUsers, setGroupUsers] = useState<
    firebase.firestore.DocumentData[]
  >([]);

  // get permission
  useEffect(() => {
    requestPermissionsAsync();
    const unsubscribe = getGroupUserCollection(group.id).onSnapshot((snap) => {
      const users = snap.docs.map((doc) => doc.data());
      setGroupUsers(users);
    });
    return () => unsubscribe();
  }, []);

  const requestPermissionsAsync = async () => {
    const { granted } = await Notifications.getPermissionsAsync();
    if (granted) {
      return;
    }
    await Notifications.requestPermissionsAsync();
  };

  const dismissWalkthroughModal = async () => {
    setVisibleWalkthrough(false);
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
