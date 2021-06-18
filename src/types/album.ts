import firebase from "firebase";

export type Album = {
  id?: string;
  place: string;
  imageUrl: string;
  createdAt: firebase.firestore.Timestamp;
};
