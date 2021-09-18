import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  onPress: () => void;
};

export const GarbageButton: React.FC<Props> = ({ onPress }: Props) => {
  return (
    <MaterialIcons
      name="delete"
      size={24}
      style={{ marginRight: 20 }}
      color="white"
      onPress={onPress}
    />
  );
};
