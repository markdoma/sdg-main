"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Misc/Loading";
import { db } from "@/utils/firebase";
import Home from "@/components/Members/Home";
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
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  // const [initialMembers, setInitialMembers] = useState([]);
  // const [sdgNotYetRegistered, setSdgNotYetRegistered] = useState(false); // Track SDG registration status
  const {
    user,
    signInWithGoogle,
    logout,
    error,
    notRegistered,
    setNotRegistered,
    navigation,
    initialMembers,
    loading, // Use loading from context
  } = useAuth();

  console.log(initialMembers);

  if (loading) {
    return (
      <div className="text-center">
        <Loading />
      </div>
    );
  }

  // If there's an error, return the error as part of pageProps
  if (error) {
    return {
      props: {
        error, // Pass error to _app.js through pageProps
      },
    };
  }

  // Conditional rendering: If user is authenticated and email is found in master_data, show the Home component
  if (user && initialMembers.length > 0) {
    return (
      <Home
        initialMembers={initialMembers}
        userEmail={user.email}
        userRole={user.role}
        plName={user.pl_name}
        notRegistered={notRegistered}
        setNotRegistered={setNotRegistered}
      />
    );
  }
  return null;
}
