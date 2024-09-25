import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, provider, db } from "../utils/firebase";
import Cookies from "js-cookie";
import Loading from "../components/Misc/Loading";
import { useRouter } from "next/router";

import {
  Bars3CenterLeftIcon,
  BellIcon,
  ClockIcon,
  CogIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [notRegistered, setNotRegistered] = useState(false); // State for not registered users
  const router = useRouter();
  const [navigation, setNavigation] = useState([
    { name: "Home", href: "/home", icon: HomeIcon },
    { name: "Registration", href: "/registration", icon: ClockIcon },
    { name: "Finance", href: "/finance", icon: ScaleIcon },
    { name: "Family Life Ministry", href: "/flm", icon: UserGroupIcon },
    { name: "Tech", href: "/scan", icon: UserGroupIcon },
    { name: "Foundation Course", href: "/fc", icon: DocumentChartBarIcon },
    { name: "Hook Programs", href: "/hook", icon: UserGroupIcon },
  ]);

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
    setError(null); // Reset error before starting sign-in
    setNotRegistered(false);
    setLoading(true);

    try {
      console.log("firebase checks");
      const result = await auth.signInWithPopup(provider);
      const user = result.user;

      await setTokenInCookie();

      // Redirect to /home after sign-in
      // router.push("/home");
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
      router.push("/home");
    }
  };

  const logout = async () => {
    await auth.signOut();
    Cookies.remove("token"); // Remove the token from cookies
    setUser(null);
    setNotRegistered(false);
    setNavigation([
      { name: "Home", href: "/home", icon: HomeIcon },
      { name: "Registration", href: "/registration", icon: ClockIcon },
      { name: "Finance", href: "/finance", icon: ScaleIcon },
      { name: "Family Life Ministry", href: "/flm", icon: UserGroupIcon },
      { name: "Tech", href: "/scan", icon: UserGroupIcon },
      { name: "Foundation Course", href: "/fc", icon: DocumentChartBarIcon },
      { name: "Hook Programs", href: "/hook", icon: UserGroupIcon },
    ]);

    router.push("/"); // Redirect to the home page
  };

  // Function to fetch user data from Firestore
  const fetchUserData = async (email) => {
    try {
      const userDoc = await db.collection("users").doc(email).get();
      if (!userDoc.exists) {
        setNotRegistered(true);
        setNavigation([
          { name: "Registration", href: "/registration", icon: ClockIcon },
        ]); // Only show registration
        router.push("/registration");
      } else {
        setNotRegistered(false);
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
      setError(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, signInWithGoogle, navigation, logout }}
    >
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
