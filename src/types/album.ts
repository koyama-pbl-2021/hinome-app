import firebase from 'firebase';

// [TODO]ここは適切なものに修正
export type Album = {
  id?: string;
  place: string;
  imageUrl: string;
  createdAt: firebase.firestore.Timestamp;
};
