import { createContext } from 'react';

type VisibleWalkthroughContextValue = {
  visibleWalkthrough: boolean | null;
  setVisibleWalkthrough: (visibleWalkthrough: boolean | null) => void;
};

export const VisibleWalkthroughContext =
  createContext<VisibleWalkthroughContextValue>({
    visibleWalkthrough: false,
    setVisibleWalkthrough: () => {
      // 何もしない
    },
  });
