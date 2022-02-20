import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  StatusBar,
  FlatList,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
/* components */
import { HourButton } from '../components/HourButton';
import { WalkthroughModal } from '../components/WalkthroughModal';
/* contexts */
import { VisibleWalkthroughContext } from '../contexts/VisibleWalkthroughContext';
/* types */
import { RootStackParamList } from '../types/navigation';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'TimeSelect'>;
  route: RouteProp<RootStackParamList, 'TimeSelect'>;
};

export const TimeSelectScreen: React.FC<Props> = ({
  navigation,
  route,
}: Props) => {
  const { userName, groupName } = route.params;
  const { visibleWalkthrough, setVisibleWalkthrough } = useContext(
    VisibleWalkthroughContext
  );
  const [hours] = useState<string[]>(['1', '2', '4', '8', '12', '24']);

  const onPressHour = (hour: string) => {
    navigation.navigate('HinomeStart', { hour, userName, groupName });
  };

  const dismissWalkthroughModal = async () => {
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
      style={styles.viewLinearGradient}
    >
      <SafeAreaView style={styles.container}>
        <WalkthroughModal
          visible={visibleWalkthrough}
          dismissModal={dismissWalkthroughModal}
        />
        <FlatList
          style={styles.itemContainer}
          data={hours}
          renderItem={({ item }: { item: string }) => (
            <HourButton hour={item} onPress={() => onPressHour(item)} />
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
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
  viewLinearGradient: {
    flex: 1,
  },
});
