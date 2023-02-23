// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBY_Y-qqYzfmiU4XX5YcvA-s6xQ4V5buiQ",
  authDomain: "crwn-db-ac995.firebaseapp.com",
  projectId: "crwn-db-ac995",
  storageBucket: "crwn-db-ac995.appspot.com",
  messagingSenderId: "1039527553854",
  appId: "1:1039527553854:web:7fa38a5f97c4af3a3bda6f",
  measurementId: "G-6JGPCK75EN",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Set up DB
export const db = getFirestore();

// Set up Google Authentification
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const createUserDocumentFromAuth = async (userAuth) => {
  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await setDoc(userDocRef, { displayName, email, createdAt });
    } catch (error) {
      console.error("error creating user", error);
    }
  }

  return userDocRef;
};
