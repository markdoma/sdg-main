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
  const [notRegistered, setNotRegistered] = useState(false); // State for not registered users
  const router = useRouter();

  const handleBackToLogin = () => {
    // Refresh the page
    window.location.reload();

    // Navigate to the home page after a short delay to ensure the reload occurs first
    setTimeout(() => {
      router.push("/login");
    }, 100); // 100ms delay to ensure the reload has time to take effect
  };

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

    try {
      setLoading(true);

      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      await setTokenInCookie();

      // Fetch user role from Firestore
      const roleRef = db.collection("roles").doc(user.email);
      const roleDoc = await roleRef.get();

      if (!roleDoc.exists) {
        setNotRegistered(true); // Set state if user is not registered
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
      router.push("/home");
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
      setError(error.message);
    }
  };

  if (loading) {
    return <Loading />; // Show loading while authentication state is determined
  }

  if (notRegistered) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 py-6 text-center">
        <p className="text-lg text-blue-600">
          You are not registered as a user. Kindly contact{" "}
          <a href="mailto:markdoma10@gmail.com" className="underline">
            markdoma10@gmail.com
          </a>
        </p>
        {/* <button className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <a href="/login"> Return to Home</a>
        </button> */}

        <img
          // src="https://developers.google.com/identity/images/g-logo.png" // Google logo image URL
          src="/google.png" // Google logo image URL
          alt="Sign in with Google"
          className={`cursor-pointer ${loading ? "opacity-50" : "opacity-100"}`}
          onClick={signInWithGoogle}
          style={{ width: "200px", height: "auto" }} // Adjust size as needed
        />
        {loading && (
          <p className="ml-4 text-sm text-gray-500">Signing in...</p> // Optional loading message
        )}
      </div>
    );
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
