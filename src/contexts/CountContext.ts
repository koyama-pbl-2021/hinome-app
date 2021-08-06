import { createContext } from 'react';

type CountContextValue = {
  count: number | null;
  setCount: (count: number | null) => void;
};

export const CountContext = createContext<CountContextValue>({
  count: 0,
  setCount: () => {
    // 何もしない
  },
});
