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

export const WalkthroughModal = ({ visible, dismissModal }: Props) => {
  const [viewableItemIndex, setViewableItemIndex] = useState<number>(0);
  const [buttonText, setButtonText] = useState<string>('Next');

  const flatListRef = useRef(null);

  // onViewableItemsChangedで現在見えているviewを取得。
  const onViewRef = useRef(({ viewableItems }) => {
    // 現在の見えているItemのindexをuseStateに保存
    setViewableItemIndex(viewableItems[0].index);

    // 一番最後のスライドならボタンのテキストを変える
    if (viewableItems[0].index === slides.length - 1) {
      setButtonText('Done');
    } else setButtonText('Next');
  });

  // buttonを押したら次のViewへ飛ぶ
  const onBottomButton = () => {
    if (viewableItemIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: viewableItemIndex + 1,
      });
    } else {
      // propsでmodalを消す
      dismissModal();
    }
  };

  // dotを押したらそのindexのViewへ飛ぶ
  const onDot = (index) => {
    flatListRef.current.scrollToIndex({ animated: true, index: index });
  };

  // dotの色を変える
  const dotColor = (index) => {
    return index === viewableItemIndex ? styles.colorDot : styles.whiteDot;
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
          <View style={styles.dotWrapper}>
            {slides.map((listItem, index) => {
              return (
                <TouchableOpacity
                  onPress={() => onDot(index)}
                  key={index}
                  style={[styles.dot, dotColor(index)]}
                />
              );
            })}
          </View>
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
  dotWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  colorDot: {
    backgroundColor: '#FFA700',
  },
  whiteDot: {
    backgroundColor: '#F2AB90',
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
    title: 'This is first Slide',
    text: 'This is first Slide This is first Slide This is first Slide This is first Slide',
    image: require('../../assets/logo.png'),
  },
  {
    key: '2',
    title: 'This is second Slide',
    text: 'This is first Slide This is first Slide This is first Slide This is first Slide This is first Slide',
    image: require('../../assets/logo.png'),
  },
  {
    key: '3',
    title: 'This is Third Slide',
    text: 'This is Third Slide This is Third Slide This is Third Slide',
    image: require('../../assets/logo.png'),
  },
  {
    key: '4',
    title: 'This is forth Slide',
    text: 'This is forth Slide This is forth Slide This is forth Slide This is forth Slide This is forth Slide',
    image: require('../../assets/logo.png'),
  },
];
