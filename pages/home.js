import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Team from "@/components/Members/Team";
import PageHeadingcopy from "@/components/PageHeadingcopy";

import MasterDownload from "../utils/MasterDownload";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

// import { db, auth } from "../utils/firebase";
import { auth_server, db_server } from "../utils/firebaseAdmin";
import { auth, db } from "../utils/firebase";
import Link from "next/link";
import cookie from "cookie";
import { useAuth } from "@/context/AuthContext";
import Loading from "../components/Misc/Loading";

export async function getServerSideProps(context) {
  // const { req } = context;
  // const token = req.cookies.token; // Assuming the token is stored in cookies

  const { req } = context;
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token; // Get the token from cookies

  // console.log(context);
  // console.log(token);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    // Verify the ID token
    const decodedToken = await auth_server.verifyIdToken(token);
    const userEmail = decodedToken.email;
    console.log(userEmail);

    // Fetch user data from Firestore
    const userDoc = await db_server.collection("users").doc(userEmail).get();
    const userData = userDoc.data();

    console.log(userData);
    if (!userData) {
      return {
        notFound: true,
      };
    }

    // Fetch and filter other data based on user data
    const masterDataSnapshot = await db_server
      .collection("master_data")
      .where("pl", "==", userData.pl_name)
      .get();

    // console.log(masterDataSnapshot);

    const initialMembers = masterDataSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        insert_date: data.insert_date
          ? data.insert_date.toDate().toISOString()
          : null,
        birthdate: data.birthdate
          ? data.birthdate.toDate().toISOString()
          : null,
        weddingdate: data.weddingdate
          ? data.weddingdate.toDate().toISOString()
          : null,
      };
    });

    console.log(initialMembers);

    return {
      props: { initialMembers },
    };
  } catch (error) {
    console.error("Error verifying token or fetching data:", error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

export default function home({ initialMembers }) {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([initialMembers]);
  const [loading, setLoading] = useState(true);
  // const [cachedMembers, setCachedMembers] = useState([]);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const cachedData = localStorage.getItem("members");
  //     if (cachedData) {
  //       // Use cached data if available
  //       setCachedMembers(JSON.parse(cachedData));
  //     } else {
  //       // Cache the data if not present
  //       localStorage.setItem("members", JSON.stringify(members));
  //       setCachedMembers(members);
  //     }
  //   }
  // }, [members]);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
        setMembers([]); // Clear members if no user
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Fetch user data from Firestore
          const userDoc = await db.collection("users").doc(user.email).get();
          const userData = userDoc.data();

          if (userData) {
            // Fetch members based on the user's data
            const masterDataSnapshot = await db
              .collection("master_data")
              .where("pl", "==", userData.pl_name)
              .get();

            const updatedMembers = masterDataSnapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                insert_date: data.insert_date
                  ? data.insert_date.toDate().toISOString()
                  : null,
                birthdate: data.birthdate
                  ? data.birthdate.toDate().toISOString()
                  : null,
                weddingdate: data.weddingdate
                  ? data.weddingdate.toDate().toISOString()
                  : null,
              };
            });

            setMembers(updatedMembers);
          } else {
            setError("User data not found.");
            setMembers([]); // Clear members if user data is not found
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Error fetching data.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              MWG Members
            </h2>
            {/* <p className="mt-4 text-lg leading-8 text-gray-600">
              We’re a dynamic group of individuals who are passionate about what
              we do.
            </p> */}
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          >
            {members
              .sort((a, b) => a.lastname.localeCompare(b.lastname))
              .map((member) => (
                <li key={member.id}>
                  <Link href={`/members/${member.id}`}>
                    <img
                      alt=""
                      // src="https://i.pravatar.cc/300"
                      // src={`https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${member.firstname} ${member.lastname}`}
                      // src={member.imageUrl}
                      src={
                        member.gender === "Female"
                          ? "https://avatar.iran.liara.run/public/girl"
                          : "https://avatar.iran.liara.run/public/boy"
                      }
                      className="mx-auto h-56 w-56 rounded-full"
                    />
                    <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900">
                      {member.firstname} {member.lastname}
                    </h3>
                    <p className="text-sm leading-6 text-gray-600">
                      {member.ligaya_class}
                    </p>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
