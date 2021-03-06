import firebase from 'firebase';
/* env */
import env from '../../env.json';
/* types */
import { initialUser, User } from '../types/user';
import { Album } from '../types/album';
import { Notification } from '../types/notification';

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

// export const signUp = async (
//   userName: string,
//   email: string,
//   password: string
// ) => {
//   try {
//     const userCredential = await firebase
//       .auth()
//       .createUserWithEmailAndPassword(email, password);
//     const { uid } = userCredential.user;
//     const user = {
//       id: uid,
//       userName: userName,
//       email: email,
//     } as User;
//     await firebase.firestore().collection('users').doc(uid).set(user);
//     return user;
//   } catch (err) {
//     return false;
//   }
// };

export const signIn = async () => {
  const userCredintial = await firebase.auth().signInAnonymously();
  const { uid } = userCredintial.user;
  const userDoc = await firebase.firestore().collection('users').doc(uid).get();
  if (!userDoc.exists) {
    await firebase.firestore().collection('users').doc(uid).set(initialUser);
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

export const getUserRef = async (userId: string) => {
  return await firebase.firestore().collection('users').doc(userId);
};

export const logIn = async (email: string, password: string) => {
  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const { uid } = userCredential.user;
    const userDoc = await firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .get();
    if (!userDoc.exists) {
      return false;
    } else {
      return {
        ...userDoc.data(),
      } as User;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

// export const logInCheck = () => {
//   firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//       return {
//         userId: user.uid,
//         email: user.email,
//       } as User;
//     } else {
//       return null;
//     }
//   });
// };

export const logOut = async () => {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    console.log(err);
  }
};

export const getAlbum = async (userId: string, albumId: string) => {
  const snapshot = await firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('albums')
    .doc(albumId)
    .get();
  if (!snapshot.exists) {
    return null;
  } else {
    return {
      ...snapshot.data(),
    } as Album;
  }
};

export const getAlbums = async (userId: string) => {
  const snapshot = await firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('albums')
    // .orderBy('score', 'desc') //????????????????????????????????????
    .get();
  const albums = snapshot.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id } as Album)
  );
  return albums;
};

export const upLoadImg = async (uri: string, path: string) => {
  const ImageUrl = await fetch(uri);
  const blob = await ImageUrl.blob();

  const ref = firebase.storage().ref().child(path);
  let downloadUrl = '';

  try {
    await ref.put(blob);
    downloadUrl = await ref.getDownloadURL();
  } catch (err) {
    console.log(err);
  }
  return downloadUrl;
};

export const createAlbumRef = async (userId: string) => {
  return await firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('albums')
    .doc();
};

export const getAlbumRef = async (userId: string, albumId: string) => {
  return await firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('albums')
    .doc(albumId);
};

export const createPhotoRef = async (albumId: string, userId: string) => {
  return await firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('albums')
    .doc(albumId)
    .collection('photos')
    .doc();
};

export const createNotificationRef = async (
  albumId: string,
  userId: string
) => {
  return await firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('albums')
    .doc(albumId)
    .collection('notifications')
    .doc();
};

export const saveNotifications = async (
  albumId: string,
  userId: string,
  notifyAts: firebase.firestore.Timestamp[]
) => {
  const batch = firebase.firestore().batch();
  for (const notifyAt of notifyAts) {
    const notificationRef = await createNotificationRef(albumId, userId);
    const notification = {
      id: notificationRef.id,
      // group????????????????????????
      groupId: '',
      isTaken: false,
      notifyAt: notifyAt,
    } as Notification;
    batch.set(notificationRef, notification);
  }
  await batch.commit();
};

// albumId????????????????????????
export const getPhotos = async (albumId: string, userId: string) => {
  const snapshot = await firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('albums')
    .doc(albumId)
    .collection('photos')
    .orderBy('createdAt', 'desc')
    .get();
  const photos = snapshot.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id } as Album)
  );
  return photos;
};

export const getNotifications = async (albumId: string, userId: string) => {
  const snapshot = await firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('albums')
    .doc(albumId)
    .collection('notifications')
    .orderBy('notifyAt', 'asc')
    .get();
  if (snapshot.empty) {
    return false;
  }
  const notifications = snapshot.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id } as Notification)
  );
  return notifications;
};

export const getNotification = async (
  albumId: string,
  userId: string,
  notificationId: string
) => {
  return await firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('albums')
    .doc(albumId)
    .collection('notifications')
    .doc(notificationId);
};
