import firebase from 'firebase';

export type Notification = {
  id: string;
  groupId?: string;
  notifyAt: firebase.firestore.Timestamp;
};
