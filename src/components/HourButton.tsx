import React from 'react';
import { StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
/* components */

const { width } = Dimensions.get('window');
const CONTAINER_WIDTH = width / 2;
const PADDING = 16;
const IMAGE_WIDTH = CONTAINER_WIDTH - PADDING * 2;

type Props = {
  hour: string;
  onPress: () => void;
};

export const HourButton: React.FC<Props> = ({ hour, onPress }: Props) => {
  // [TODO] dateの追加
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.hourText}>{hour}</Text>
      <Text style={styles.placeText}>hour</Text>
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
  hourText: {
    fontSize: 24,
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
