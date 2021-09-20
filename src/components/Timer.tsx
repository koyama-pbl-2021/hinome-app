import React from 'react';
import { StyleSheet, View, GestureResponderEvent } from 'react-native';
import CountDown from 'react-native-countdown-component';

type Props = {
  onFinish: () => void;
};
export const Timer: React.FC<Props> = ({ onFinish }: Props) => {
  return (
    <View style={styles.container}>
      <CountDown
        until={+60}
        size={30}
        onFinish={onFinish}
        digitStyle={{ backgroundColor: 'transparent' }}
        digitTxtStyle={{ color: '#1CC625' }}
        timeToShow={['S']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
