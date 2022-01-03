import { Album } from './album';
import { Notification } from './notification';

export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  Album: { currentAlbum: Album };
  Camera: { currentNotification: Notification };
  Hinome: undefined;
  TimeSelect: undefined;
  HinomeStart: { hour: string };
};
