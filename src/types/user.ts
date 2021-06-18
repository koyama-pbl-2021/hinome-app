import firebase from "firebase";

export type User = {
  id?: string;
  email: string;
  updatedAt: firebase.firestore.Timestamp;
  createdAt: firebase.firestore.Timestamp;
};

export const initialUser: User = {
  email: "",
  updatedAt: firebase.firestore.Timestamp.now(),
  createdAt: firebase.firestore.Timestamp.now(),
};
