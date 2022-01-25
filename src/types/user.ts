import firebase from 'firebase';

export type User = {
  id?: string;
  name?: string;
  updatedAt: firebase.firestore.Timestamp;
  createdAt: firebase.firestore.Timestamp;
  isFirst: boolean;
};

export const initialUser: User = {
  name: '',
  updatedAt: firebase.firestore.Timestamp.now(),
  createdAt: firebase.firestore.Timestamp.now(),
  isFirst: true,
};
