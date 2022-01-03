import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
/* components */
import { WalkthroughModal } from '../components/WalkthroughModal';
/* contexts */
import { UserContext } from '../contexts/UserContext';
import { VisibleWalkthroughContext } from '../contexts/VisibleWalkthroughContext';
/* types */
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'HostInput'>;
};

export const HostInputScreen: React.FC<Props> = ({ navigation }: Props) => {
  const { user } = useContext(UserContext);
  const { visibleWalkthrough, setVisibleWalkthrough } = useContext(
    VisibleWalkthroughContext
  );

  const onNext = async () => {
    navigation.navigate('TimeSelect');
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
        <View style={styles.startContainer}>
          <TextInput style={styles.nameInput}></TextInput>
          <TouchableOpacity onPress={onNext} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>次へ</Text>
          </TouchableOpacity>
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
  nameInput: {
    backgroundColor: 'white',
    borderRadius: 0,
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
  nextButton: {
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
