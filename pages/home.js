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
import { useRouter } from "next/router";

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
    // console.log(userEmail);

    // Fetch user data from Firestore
    const userDoc = await db_server.collection("users").doc(userEmail).get();
    const userData = userDoc.data();

    console.log(userData);
    if (!userData) {
      return {
        props: {
          notRegistered: true,
          isLoading: true,
        },
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

    // console.log(initialMembers);

    return {
      props: { initialMembers, isLoading: true, notRegistered: false },
    };
  } catch (error) {
    console.error("Error verifying token or fetching data:", error);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}

export default function home({ initialMembers, notRegistered, isLoading }) {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState(initialMembers);
  const [loading, setLoading] = useState(isLoading);
  const router = useRouter();

  // Simulate a delay to show loading for a short period (e.g., 2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // 2-second delay for the loading screen

    // Clear the timer if the component unmounts to avoid memory leaks
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  // Check if the user is not registered
  if (notRegistered) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg text-blue-600">
          You are not registered as a user. Kindly contact{" "}
          <a href="mailto:markdoma10@gmail.com" className="underline">
            markdoma10@gmail.com
          </a>
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Return to Login
        </button>
      </div>
    );
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
