"use client";

import { useState, useEffect } from "react";
import { useAuth, AuthProvider } from "../context/AuthContext"; // Ensure AuthProvider is imported
import Loading from "../components/Misc/Loading";

import Home from "../components/Members/Home";
import MemberLanding from "../components/Members/MemberLanding";
import {
  getDocs,
  query,
  where,
  doc,
  getDoc,
  collection,
} from "firebase/firestore";
import { useRouter } from "next/router";

export default function Ligayasdg() {
  const [userData, setUserData] = useState(null);
  const {
    user,
    signInWithGoogle,
    logout,
    error,
    setError,
    notRegistered,
    setNotRegistered,
    navigation,
    initialMembers,
    loading, // Use loading from context
    userDetails, // Add userDetails from context
  } = useAuth();

  console.log(error);

  if (loading) {
    return <Loading />;
  }

  // Conditional rendering: If user is authenticated and email is found in master_data, show the appropriate component
  if (
    userDetails &&
    (userDetails.pl === "Lito & Bless Saquilayan" ||
      userDetails.pl === "Frat Group")
  ) {
    // Use service_role from userDetails
    return (
      <Home
        initialMembers={initialMembers}
        userEmail={user.email}
        userRole={userDetails.service_role}
        plName={userDetails.pl}
        notRegistered={notRegistered}
        setNotRegistered={setNotRegistered}
      />
    );
  } else {
    return <MemberLanding />;
  }

  return null;
}

// Ensure AuthProvider is used to wrap the application
function App() {
  return (
    <AuthProvider>
      <Ligayasdg />
    </AuthProvider>
  );
}
