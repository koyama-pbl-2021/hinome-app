import React, { useContext } from 'react';
import { Entypo } from '@expo/vector-icons';
/* context*/
import { VisibleWalkthroughContext } from '../contexts/VisibleWalkthroughContext';

export const HelpButton: React.FC = () => {
  const { setVisibleWalkthrough } = useContext(VisibleWalkthroughContext);
  return (
    <Entypo
      style={{ marginRight: 20 }}
      name="help"
      size={24}
      color="white"
      onPress={() => {
        setVisibleWalkthrough(true);
      }}
    />
  );
};
