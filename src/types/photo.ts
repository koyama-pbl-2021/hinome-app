import firebase from "firebase";

export type Photo = {
  id?: string;
  place: string;
  imageUrl: string;
  createdAt: firebase.firestore.Timestamp;
};
