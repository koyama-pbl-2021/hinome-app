import firebase from 'firebase';

export type Notification = {
  id: string;
  groupId?: string;
  isTaken: boolean;
  notifyAt: firebase.firestore.Timestamp;
};
