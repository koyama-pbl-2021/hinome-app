import { Album } from './album';

export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  Album: { album: Album };
  Hinome: undefined;
  LogIn: undefined;
  SignUp: undefined;
};
