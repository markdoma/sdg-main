// components/GoogleAuth.js
import React from "react";
import firebase from "../utils/firebase"; // Import the firebase object

const GoogleAuth = () => {
  const handleSignInWithGoogle = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider(); // Use the firebase object to access GoogleAuthProvider
      await firebase.auth().signInWithPopup(provider); // Use firebase.auth() to call signInWithPopup
      // Handle successful Google sign-in
    } catch (error) {
      console.error("Error signing in with Google:", error);
      // Handle Google sign-in error
    }
  };

  const handleCheckAuthState = () => {
    firebase.auth().onAuthStateChanged((user) => {
      // Use firebase.auth() to access onAuthStateChanged
      if (user) {
        console.log("User is authenticated:", user);
      } else {
        console.log("User is not authenticated.");
      }
    });
  };

  return (
    <div>
      <button onClick={handleSignInWithGoogle}>Sign In with Google</button>
      <button onClick={handleCheckAuthState}>Check Auth State</button>
    </div>
  );
};

export default GoogleAuth;
