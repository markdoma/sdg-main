import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../utils/firebase";
import MemberHeading from "@/components/Members/MemberHeading";
import Details from "@/components/Members/Details";

export default function MemberPage() {
  const router = useRouter();
  const { id } = router.query; // Get the ID from the query parameters

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // Wait until ID is available

    // Check localStorage for cached data
    const cachedData = localStorage.getItem(`member_${id}`);
    if (cachedData) {
      setMember(JSON.parse(cachedData));
      setLoading(false);
      return;
    }

    // If no cached data, fetch from Firestore
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

        // Cache the fetched data in localStorage
        localStorage.setItem(`member_${id}`, JSON.stringify(memberData));

        setMember(memberData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching document:", error);
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]); // Dependency array includes `id` to re-run effect if `id` changes

  if (loading) {
    return <p>Loading...</p>;
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
      {/* <h1>Member Details</h1>
      <p>ID: {member.id}</p>
      <p>Name: {member.firstname}</p>
      <p>Last Name: {member.lastname}</p>
      {/* Add more member details here */}
      {/* <button onClick={() => router.push("/members")}>
        Back to Members List
      </button>{" "} */}
    </div>
  );
}
