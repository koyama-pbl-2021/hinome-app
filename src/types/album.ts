import firebase from 'firebase';

// [TODO]ここは適切なものに修正
export type Album = {
  id?: string;
  userId?: string;
  groupId?: string;
  imageUrl: string;
  createdAt: firebase.firestore.Timestamp;
  startAt: firebase.firestore.Timestamp;
  endAt: firebase.firestore.Timestamp;
};
