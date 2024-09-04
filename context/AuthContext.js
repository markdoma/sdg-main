import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, provider, db } from "../utils/firebase";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false); // Set loading to false once user is determined
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  // Function to set Firebase ID token in cookies
  const setTokenInCookie = async () => {
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken();
      Cookies.set("token", idToken, { expires: 1, path: "/" });
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null); // Reset error before starting sign-in
    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      console.log("User signed in:", user);
      setTokenInCookie();
      // Fetch user role from Firestore
      const roleRef = db.collection("roles").doc(user.email);
      const roleDoc = await roleRef.get();
      console.log(roleDoc);

      if (!roleDoc.exists) {
        throw new Error("User role not found.");
      }

      const role = roleDoc.data().role;
      const pl_name = roleDoc.data().pl;

      // Update Firestore with user information
      const userRef = db.collection("users").doc(user.email);
      await userRef.set(
        {
          email: user.email,
          displayName: user.displayName,
          avatar: user.photoURL,
          role: role, // Store user role
          pl_name: pl_name, // Store pl name
        },
        { merge: true }
      );
      router.push("/home");
      // Handle post-sign-in logic (e.g., redirect or store user data)
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
