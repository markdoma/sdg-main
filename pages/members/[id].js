import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../utils/firebase";
import MemberHeading from "@/components/Members/MemberHeading";
import Details from "@/components/Members/Details";
import Loading from "../../components/Misc/Loading";

export default function MemberPage() {
  const router = useRouter();
  const { id } = router.query; // Get the ID from the query parameters

  const [member, setMember] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]); // State for attendance data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // Wait until ID is available

    // Fetch member data from Firestore
    const fetchMember = async () => {
      try {
        const memberRef = db.collection("master_data").doc(id);
        const doc = await memberRef.get();

        if (!doc.exists) {
          setError("Member not found");
          setLoading(false);
          return;
        }

        const data = doc.data();
        const memberData = {
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

        setMember(memberData);

        // Fetch attendance data
        const unsubscribe = db
          .collectionGroup("attendance")
          .where("id", "==", id) // Assuming 'memberId' is the field that references the member
          .onSnapshot((snapshot) => {
            const fetchedAttendance = snapshot.docs.map((doc) => doc.data());
            // Convert Firestore timestamps to JavaScript Date objects
            const processedAttendanceData = fetchedAttendance.map((item) => ({
              ...item,
              date: item.date.toDate().toLocaleDateString("en-US"), // Assuming 'date' is the field with the timestamp
            }));
            setAttendanceData(processedAttendanceData);
          });

        return () => {
          // Unsubscribe from the snapshot listener when the component unmounts
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching document:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]); // Dependency array includes `id` to re-run effect if `id` changes

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!member) {
    return <p>Member not found</p>;
  }

  return (
    <div>
      <MemberHeading member={member} />
      <Details member={member} />
      {/* Render attendance data */}
      {attendanceData.length > 0 ? (
        <div className="mx-auto mt-8 px-4 max-w-7xl">
          <table className="min-w-full divide-y divide-gray-300  mx-auto mt-4 mb-8">
            <thead>
              <tr>
                {/* <th
                  scope="col"
                  className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Firstname
                </th> */}
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Event
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {attendanceData.map((item, index) => (
                <tr key={index}>
                  {/* <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    {item.firstname}
                  </td> */}
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                    {item.event}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                    {item.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center mt-4">No attendance records found</p>
      )}
    </div>
  );
}
