import firebase from 'firebase';

export type Notification = {
  id: string;
  userId?: string;
  groupId?: string;
  albumId: string;
  notifyAt: firebase.firestore.Timestamp;
};
