import { createContext } from 'react';

type IsSingleContextValue = {
  isSingle: boolean | null;
  setIsSingle: (isSingle: boolean | null) => void;
};

export const IsSingleContext = createContext<IsSingleContextValue>({
  isSingle: false,
  setIsSingle: () => {
    // 何もしない
  },
});
