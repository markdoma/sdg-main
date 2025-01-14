// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApAFNETwBUvoIbDzySJGjFVTHdUItD4XE",
  authDomain: "ligayasdg.firebaseapp.com",
  projectId: "ligayasdg",
  storageBucket: "ligayasdg.appspot.com",
  messagingSenderId: "781228396188",
  appId: "1:781228396188:web:3152f1dc5996a236306759",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get references to the services
const auth = getAuth(app); // Firebase Authentication
const db = getFirestore(app); // Firestore Database
const storage = getStorage(app); // Firebase Storage

// Set up Google Auth provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account", // Force account selection
});

// Export the services
export { db, storage, auth, provider };
