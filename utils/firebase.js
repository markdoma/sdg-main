// firebase.js
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// import { getDownloadURL, ref, getMetadata } from "@firebase/storage";
// import { collection, addDoc } from "@firebase/firestore";

import firebase from "firebase/app";
import "firebase/auth"; // Import the Firebase Authentication module
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyApAFNETwBUvoIbDzySJGjFVTHdUItD4XE",
  authDomain: "ligayasdg.firebaseapp.com",
  projectId: "ligayasdg",
  storageBucket: "ligayasdg.appspot.com",
  messagingSenderId: "781228396188",
  appId: "1:781228396188:web:3152f1dc5996a236306759",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth(); // Export the Firebase Authentication instance
export const db = firebase.firestore();
export const storage = firebase.storage();

export default firebase; // Export the default Firebase object
