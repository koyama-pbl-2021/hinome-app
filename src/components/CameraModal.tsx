import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

type Props = {
  visible: boolean;
  onClick: () => void;
};

export const CameraModal: React.FC<Props> = ({ visible, onClick }: Props) => {
  const [buttonText] = useState<string>('OK');
  const cameraRef = useRef(null);

  // buttonを押したら次のViewへ飛ぶ
  const onBottomButton = () => {
    // propsでmodalを消す
    onClick();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.container}>
        <View style={styles.bottomWrapper}>
          <TouchableOpacity style={styles.button} onPress={onBottomButton}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 117, 108, 0.9)',
  },
  bottomWrapper: {
    position: 'absolute',
    bottom: 70,
    alignItems: 'center',
  },
  button: {
    marginTop: 18,
  },
  buttonText: {
    fontSize: 19,
    color: '#fff',
  },
});
