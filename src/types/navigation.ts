import { Album } from './album';

export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  Album: { currentAlbum: Album };
  Hinome: undefined;
  HinomeStart: { hour: string };
  LogIn: undefined;
  SignUp: undefined;
};
