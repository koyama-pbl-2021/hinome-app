import React from 'react';
import { StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
/* components */
/* types */
import { Photo } from '../types/photo';

const { width } = Dimensions.get('window');
const CONTAINER_WIDTH = width / 2;
const PADDING = 16;
const IMAGE_WIDTH = CONTAINER_WIDTH - PADDING * 2;

type Props = {
  photo: Photo;
  onPress: () => void;
};

export const PhotoItem: React.FC<Props> = ({ photo, onPress }: Props) => {
  const { place, imageUrl, createdAt } = photo;
  // [TODO] dateの追加
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image uri={imageUrl} style={styles.image} />
      <Text style={styles.placeText}>{createdAt.toDate().toDateString()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_WIDTH,
    padding: 16,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH * 0.7,
  },
  nameText: {
    fontSize: 16,
    color: '#000',
    marginTop: 8,
    fontWeight: 'bold',
  },
  placeText: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
});
