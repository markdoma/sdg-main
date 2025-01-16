"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Misc/Loading";
import { db } from "@/utils/firebase";
import Home from "@/components/Members/Home";
import MemberLanding from "@/components/Members/MemberLanding"; // Import Member component
import {
  getDocs,
  query,
  where,
  doc,
  getDoc,
  collection,
} from "firebase/firestore";
import { useRouter } from "next/router";
import MemberLanding from "@/components/Members/MemberLanding";

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
    setError,
    notRegistered,
    setNotRegistered,
    navigation,
    initialMembers,
    loading, // Use loading from context
    userDetails, // Add userDetails from context
  } = useAuth();

  console.log(error);

  // Conditional rendering: If user is authenticated and email is found in master_data, show the appropriate component
  if (user && initialMembers.length > 0) {
    if (userDetails.service_role === "pl") {
      // Use service_role from userDetails
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
    } else {
      return <MemberLanding />;
    }
  }
  return null;
}
