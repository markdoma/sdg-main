import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, provider, db } from "../utils/firebase";
import Cookies from "js-cookie";
import Loading from "../components/Misc/Loading";
import { useRouter } from "next/router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading state
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        // Fetch user data if user is authenticated
        await fetchUserData(user.email);
      }
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
    router.push("/home");
    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      await setTokenInCookie();

      // Fetch user role from Firestore
      const roleRef = db.collection("roles").doc(user.email);
      const roleDoc = await roleRef.get();

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
          role: role,
          pl_name: pl_name,
        },
        { merge: true }
      );

      // Redirect to /home after sign-in
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch user data from Firestore
  const fetchUserData = async (email) => {
    try {
      const roleRef = db.collection("roles").doc(email);
      const roleDoc = await roleRef.get();

      if (!roleDoc.exists) {
        throw new Error("User role not found.");
      }

      const role = roleDoc.data().role;
      const pl_name = roleDoc.data().pl;

      // Update Firestore with user information
      const userRef = db.collection("users").doc(email);
      await userRef.set(
        {
          email: email,
          displayName: auth.currentUser.displayName,
          avatar: auth.currentUser.photoURL,
          role: role,
          pl_name: pl_name,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  if (loading) {
    return <Loading />; // Show loading while authentication state is determined
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {children}
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
