import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  doc,
  getDoc,
  collectionGroup,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import MemberHeading from "../../components/Members/MemberHeading";
import Details from "../../components/Members/Details";
import AttendanceData from "../../components/Members/AttendanceData";
import Loading from "../../components/Misc/Loading";

const initialNavigation = [
  { name: "Profile", href: "#", current: true },
  { name: "Attendance", href: "#", current: false },
  { name: "Foundation Course", href: "#", current: false },
  // { name: "Collaborators", href: "#", current: false },
  // { name: "Notifications", href: "#", current: false },
];

// const tabs = [
//   { name: "My Account", href: "#", current: true },
//   { name: "Company", href: "#", current: false },
//   { name: "Team Members", href: "#", current: false },
//   { name: "Billing", href: "#", current: false },
// ];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MemberPage() {
  const router = useRouter();
  const { id } = router.query; // Get the ID from the query parameters

  const [member, setMember] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]); // State for attendance data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Profile"); // State for active tab

  const handleBackToList = () => {
    router.push("/");
  };

  useEffect(() => {
    if (!id) return; // Wait until ID is available

    // Fetch member data from Firestore
    const fetchMember = async () => {
      try {
        const memberRef = doc(db, "master_data", id);
        const docSnap = await getDoc(memberRef);

        if (!docSnap.exists()) {
          setError("Member not found");
        } else {
          const data = docSnap.data();
          const memberData = {
            id: docSnap.id,
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

          setMember(memberData);

          // Fetch attendance data
          const attendanceQuery = query(
            collectionGroup(db, "attendance"),
            where("id", "==", id) // Assuming 'id' is the field that references the member
          );

          const unsubscribe = onSnapshot(attendanceQuery, (snapshot) => {
            const fetchedAttendance = snapshot.docs.map((doc) => doc.data());
            // Convert Firestore timestamps to JavaScript Date objects
            const processedAttendanceData = fetchedAttendance.map((item) => ({
              ...item,
              date: item.date.toDate().toLocaleDateString("en-US"), // Assuming 'date' is the field with the timestamp
            }));
            setAttendanceData(processedAttendanceData);
          });

          return unsubscribe; // Return the unsubscribe function to clean up the listener
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]); // Dependency array includes `id` to re-run effect if `id` changes

  const handleNavClick = (name) => {
    setActiveTab(name);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!member) {
    return <p>Member not found</p>;
  }

  const updatedNavigation = initialNavigation.map((item) => ({
    ...item,
    current: item.name === activeTab,
  }));

  return (
    <div>
      <MemberHeading member={member} />
      <div className="px-4 py-6 sm:px-6">
        <button
          onClick={handleBackToList}
          className="mb-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Back to list
        </button>
      </div>
      <div className=" sm:block">
        <nav
          aria-label="Tabs"
          className="isolate flex divide-x divide-gray-200 rounded-lg shadow"
        >
          {updatedNavigation.map((tab, tabIdx) => (
            <a
              key={tab.name}
              href={tab.href}
              aria-current={tab.current ? "page" : undefined}
              className={classNames(
                tab.current
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700",
                tabIdx === 0 ? "rounded-l-lg" : "",
                tabIdx === tab.length - 1 ? "rounded-r-lg" : "",
                "group relative min-w-0 flex-1 overflow-hidden bg-white px-4 py-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10"
              )}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(tab.name);
              }}
            >
              <span>{tab.name}</span>
              <span
                aria-hidden="true"
                className={classNames(
                  tab.current ? "bg-indigo-500" : "bg-transparent",
                  "absolute inset-x-0 bottom-0 h-0.5"
                )}
              />
            </a>
          ))}
        </nav>
      </div>

      {activeTab === "Profile" && <Details member={member} />}
      {activeTab === "Attendance" && (
        <AttendanceData attendance={attendanceData} />
      )}
    </div>
  );
}
