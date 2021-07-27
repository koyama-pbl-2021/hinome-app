import { createContext } from 'react';
import { User } from '../types/user';
import { logInCheck } from '../lib/firebase';

type UserContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {
    logInCheck();
  },
});
