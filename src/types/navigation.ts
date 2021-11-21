import { Album } from './album';

export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  Album: { currentAlbum: Album };
  Camera: undefined;
  Hinome: undefined;
  HinomeStart: { hour: string };
};
