import firebase from "firebase";
import env from "../../env.json";

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE,
  messagingSenderId: env.FIREBASE_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

export const signUp = async (email: string, password: string) => {
  const userCredential = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);
  console.log(userCredential);
};

export const logIn = async (email: string, password: string) => {
  const userCredential = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password);
  console.log(userCredential);
};
