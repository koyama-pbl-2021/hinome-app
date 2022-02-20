import { createContext } from 'react';
import { Group } from '../types/group';

type GroupContextValue = {
  group: Group | null;
  setGroup: (group: Group | null) => void;
};

export const GroupContext = createContext<GroupContextValue>({
  group: null,
  setGroup: () => {
    // 何もしない
  },
});
