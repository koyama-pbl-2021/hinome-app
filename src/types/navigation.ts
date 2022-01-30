import { Album } from './album';
import { Notification } from './notification';

export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  Album: { currentAlbum: Album };
  Camera: { currentNotification: Notification };
  Hinome: undefined;
  TimeSelect: { groupName: string };
  HinomeStart: { hour: string; groupName: string };
  Multiple: undefined;
  MultipleStart: { hour: string; groupCode: string };
  HostInput: undefined;
  JoinInput: undefined;
  WaitHost: undefined;
};
