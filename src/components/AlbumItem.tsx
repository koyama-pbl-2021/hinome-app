import React from 'react';
import { StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
/* components */
/* types */
import { Album } from '../types/album';

const { width } = Dimensions.get('window');
const CONTAINER_WIDTH = width / 2;
const PADDING = 16;
const IMAGE_WIDTH = CONTAINER_WIDTH - PADDING * 2;

type Props = {
  album: Album;
  onPress: () => void;
};

export const AlbumItem: React.FC<Props> = ({ album, onPress }: Props) => {
  const { imageUrl, createdAt } = album;
  // [TODO] dateの追加
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image style={styles.image} uri={imageUrl} />
      <Text style={styles.dateText}>{createdAt.toDate().toDateString()}</Text>
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
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
});
