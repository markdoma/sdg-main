import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import MemberHeading from "@/components/Members/MemberHeading";
import Overview from "@/components/MWG/Overview";
import AttendanceData from "@/components/Members/AttendanceData";

import { auth_server, db_server } from "../utils/firebaseAdmin";
import { auth, db } from "../utils/firebase";
import Link from "next/link";
import cookie from "cookie";
import { useAuth } from "@/context/AuthContext";
import Loading from "../components/Misc/Loading";

const initialNavigation = [
  { name: "Overview", href: "#", current: true },
  { name: "Attendance", href: "#", current: false },
  { name: "Ligaya Status", href: "#", current: false },
  // { name: "Collaborators", href: "#", current: false },
  // { name: "Notifications", href: "#", current: false },
];

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

export default function DashboardPage({ initialMembers }) {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([initialMembers]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  //   const { id } = router.query; // Get the ID from the query parameters

  //   const [member, setMember] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]); // State for attendance data

  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview"); // State for active tab

  const handleBackToList = () => {
    router.push("/home");
  };

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

  const handleNavClick = (name) => {
    setActiveTab(name);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const updatedNavigation = initialNavigation.map((item) => ({
    ...item,
    current: item.name === activeTab,
  }));

  return (
    <div>
      {/* <MemberHeading member={member} /> */}
      <div className="px-4 py-6 sm:px-6">
        <button
          onClick={handleBackToList}
          className="mb-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Back to list
        </button>
      </div>
      <nav className="flex overflow-x-auto border-b border-white/10 py-4">
        <ul
          role="list"
          className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-black-200 sm:px-6 lg:px-8"
        >
          {updatedNavigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.name);
                }}
                className={
                  item.current || activeTab === item.name ? "text-blue-400" : ""
                }
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {activeTab === "Overview" && <Overview members={initialMembers} />}
      {activeTab === "Attendance" && (
        <AttendanceData attendance={attendanceData} />
      )}
    </div>
  );
}
