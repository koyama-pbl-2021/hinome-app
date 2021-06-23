import firebase from "firebase";
/* env */
import env from "../../env.json";
/* types */
import { initialUser, User } from "../types/user";
import { Album } from "../types/album";

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE,
  messagingSenderId: env.FIREBASE_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const signUp = async (email: string, password: string) => {
  const userCredential = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);
  const { uid } = userCredential.user;
  await firebase.firestore().collection("users").doc(uid).set(initialUser);
  return {
    ...initialUser,
    id: uid,
  } as User;
};

export const logIn = async (email: string, password: string) => {
  const userCredential = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password);
  const { uid } = userCredential.user;
  const userDoc = await firebase.firestore().collection("users").doc(uid).get();
  if (!userDoc.exists) {
    // userDocが存在しないときはinitialUserをdatastoreに追加する
    await firebase.firestore().collection("users").doc(uid).set(initialUser);
    return {
      ...initialUser,
      id: uid,
    } as User;
  } else {
    return {
      id: uid,
      ...userDoc.data(),
    } as User;
  }
};

export const getAlbums = async () => {
  const snapshot = await firebase
    .firestore()
    .collection("albums")
    // .orderBy('score', 'desc') //ここは日付でソートしたい
    .get();
  const albums = snapshot.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id } as Album)
  );
  return albums;
};

export const upLoadImg = (imgName, blob): Promise<string> =>
  new Promise((resolve) => {
    const storageRef = firebase.storage().ref();
    const cloudStoragePath = storageRef.child(imgName);
    cloudStoragePath.put(blob).then((snapshot): void => {
      cloudStoragePath
        .getDownloadURL()
        .then((url) => {
          console.log("ok");
          resolve(url);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
