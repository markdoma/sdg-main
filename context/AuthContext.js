import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, provider, db } from "../utils/firebase";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  HomeIcon,
  ClockIcon,
  ScaleIcon,
  UserGroupIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [notRegistered, setNotRegistered] = useState(false); // Track if user is not registered
  const [loading, setLoading] = useState(true); // Manage loading state
  const [initialMembers, setInitialMembers] = useState([]);
  const [navigation, setNavigation] = useState([
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Registration", href: "/registration", icon: ClockIcon },
    { name: "Finance", href: "/finance", icon: ScaleIcon },
    { name: "Family Life Ministry", href: "/flm", icon: UserGroupIcon },
    { name: "Tech", href: "/scan", icon: UserGroupIcon },
    { name: "Foundation Course", href: "/fc", icon: DocumentChartBarIcon },
    { name: "Hook Programs", href: "/hook", icon: UserGroupIcon },
  ]);
  const [userDetails, setUserDetails] = useState(null); // Add state for user details
  const [searchQuery, setSearchQuery] = useState(""); // Add state for search query

  // Fetch user data and check if the user exists in the "master_data" collection
  const fetchUserData = async (emailadd) => {
    setLoading(true); // Set loading to true before starting the fetch
    try {
      emailadd = emailadd.trim(); // Trim any leading or trailing whitespaces
      console.log(`Fetching user data for email: '${emailadd}'`); // Log email address

      const masterDataQuery = query(
        collection(db, "master_data"),
        where("emailadd", "==", emailadd)
      );
      const snapshot = await getDocs(masterDataQuery);
      console.log(snapshot);

      if (snapshot.empty) {
        setUser(null); // Set user to null when logged out
        setError(
          "User not found, kindly send to your PL your latest email address."
        );
        console.log("failed");
        return;
      }
      console.log("pass error check");
      const roleDoc = snapshot.docs[0];
      const role = roleDoc.data().role;

      console.log(`this is the email ${emailadd}`);

      // Check if the user exists in the "users" collection
      const userDocRef = doc(db, "users", emailadd);
      const userDoc = await getDoc(userDocRef);
      const userFound = userDoc.exists();
      console.log(userFound);
      if (!userFound) {
        setNotRegistered(true); // Mark as not registered
      }

      // Set user details state
      setUserDetails(roleDoc.data());

      // Fetch the PL value from the roles collection
      console.log(`Checking roles collection for email: '${emailadd}'`); // Log email address before fetching roles
      const rolesDocRef = doc(db, "roles", emailadd);
      const rolesDoc = await getDoc(rolesDocRef);
      console.log(`Roles document found: ${rolesDoc.exists()}`); // Log if roles document exists
      if (!rolesDoc.exists()) {
        console.error(
          `No document found in roles collection for email: '${emailadd}'`
        );
      }
      const pl_name = rolesDoc.exists() ? rolesDoc.data().pl : null;
      console.log(`pl name: ${pl_name}`);

      // Fetch members data based on the user's PL name
      let membersSnapshot = null;
      if (pl_name) {
        let plQuery;
        if (pl_name === "admin") {
          plQuery = query(
            collection(db, "master_data"),
            where("sdg_class", "==", "LNP Member SDG"),
            where("status", "==", "Active")
          );
        } else {
          plQuery = query(
            collection(db, "master_data"),
            where("pl", "==", pl_name)
          );
        }
        membersSnapshot = await getDocs(plQuery);
      }

      if (!membersSnapshot || membersSnapshot.empty) {
        setError("No members found for this PL name.");
        return;
      }

      const membersData = membersSnapshot.docs.map((doc) => doc.data());
      setInitialMembers(membersData);
    } catch (error) {
      console.error("Error fetching user data:", error); // Log the error
      setError("Error fetching user data.");
    } finally {
      setLoading(false); // Set loading to false after the fetch completes
    }
  };

  // Function to update user details in the "master_data" collection
  const updateUserDetails = async (updatedDetails) => {
    const userDoc = doc(db, "master_data", updatedDetails.doc_id); // Ensure the correct document ID
    await updateDoc(userDoc, updatedDetails);
  };

  useEffect(() => {
    console.log("useEffect called"); // Log when useEffect is called
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is logged in"); // Log when user is logged in
        setUser(user); // Set user when logged in
        await fetchUserData(user.email); // Fetch user data when logged in

        console.log(user.email);
        setError(null);
      } else {
        console.log("User is logged out"); // Log when user is logged out
        setUser(null); // Set user to null when logged out
        setNotRegistered(false); // Reset registration state when logged out
        setInitialMembers([]); // Reset initial members when logged out
        setLoading(false); // No need to keep loading state true if no user is logged in
        setError(null);
      }
    });

    return () => {
      console.log("Cleaning up useEffect"); // Log when useEffect cleanup is called
      unsubscribe();
    };
  }, []);

  // Set Firebase ID token in cookies
  const setTokenInCookie = async () => {
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken();
      Cookies.set("token", idToken, { expires: 1, path: "/" });
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    setError(null); // Reset error before starting sign-in
    try {
      const result = await signInWithPopup(auth, provider); // Firebase v9+ use signInWithPopup
      const user = result.user;

      await setTokenInCookie(); // Set token in cookies
      await fetchUserData(user.email); // Check if the user is registered in master_data
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      setError(error.message); // Set error message if sign-in fails
    }
  };

  // Log out function
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      Cookies.remove("token");
      router.push("/");
      setUser(null);

      setNotRegistered(false); // Reset registration state on logout
    } catch (error) {
      setError(error.message); // Set error message if sign-out fails
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        logout,
        error,
        setError,
        notRegistered,
        setNotRegistered,
        navigation,
        initialMembers,
        loading, // Provide loading state to the context
        userDetails, // Provide user details to the context
        setUserDetails,
        updateUserDetails, // Provide update function to the context
        searchQuery, // Provide search query to the context
        setSearchQuery, // Provide function to update search query
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext); // Hook to access authentication state
}
