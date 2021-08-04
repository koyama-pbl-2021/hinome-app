import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';

type Props = {
  visible: boolean;
  dismissModal: () => void;
};

export const FinishModal: React.FC<Props> = ({
  visible,
  dismissModal,
}: Props) => {
  const [viewableItemIndex, setViewableItemIndex] = useState<number>(0);
  const [buttonText] = useState<string>('OK');

  const flatListRef = useRef(null);

  // onViewableItemsChangedで現在見えているviewを取得。
  const onViewRef = useRef(({ viewableItems }) => {
    // 現在の見えているItemのindexをuseStateに保存
    setViewableItemIndex(viewableItems[0].index);
  });

  // buttonを押したら次のViewへ飛ぶ
  const onBottomButton = () => {
    // propsでmodalを消す
    dismissModal();
  };

  const renderItem = (page) => {
    const { item } = page;
    return (
      <View style={styles.slideInner}>
        <Image style={styles.img} source={item.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };
  const keyExtractor = (page) => page.key;

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.container}>
        <FlatList
          data={slides}
          renderItem={renderItem}
          horizontal={true}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={flatListRef}
          keyExtractor={keyExtractor}
          onViewableItemsChanged={onViewRef.current}
        />

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
  slideInner: {
    width: width,
    justifyContent: 'center',
    paddingBottom: 80,
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  img: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginTop: 8,
    marginBottom: 12,
  },
  text: {
    fontSize: 17,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 30,
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

const slides = [
  {
    key: '1',
    title: 'アルバムができました',
    text: 'ホーム画面に移動して早速確認してみましょう！',
    image: require('../../assets/party-popper.png'),
  },
];
