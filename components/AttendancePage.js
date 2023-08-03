import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase'; // Replace this with your Firebase configuration
import AttendanceGroupCard from './AttendanceGroupCard'; // Make sure to adjust the path if necessary

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collectionGroup('attendance')
      .onSnapshot((snapshot) => {
        const fetchedAttendance = snapshot.docs.map((doc) => doc.data());
        // Convert Firestore timestamps to JavaScript Date objects
        const processedAttendanceData = fetchedAttendance.map((item) => ({
          ...item,
          date: item.date.toDate().toLocaleDateString('en-US'), // Assuming 'date' is the field with the timestamp
        }));
        setAttendanceData(processedAttendanceData);
      });

    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts
      unsubscribe();
    };
  }, []);

  // Group the attendance data based on the presence of a pastoral leader
  const memberData = attendanceData.filter(
    (item) => item.sdg_class === 'LNP Member SDG'
  );

  // Group the attendance data based on sdg_class field
  const familyData = attendanceData.filter(
    (item) => item.sdg_class === 'LNP Member SDG - Family'
  );
  const guestData = attendanceData.filter(
    (item) => item.sdg_class === 'Non-LNP-Guest'
  );
  const nonSdgData = attendanceData.filter(
    (item) => item.sdg_class === 'LNP Member Non-SDG'
  );

  // Prepare an array of groups to be rendered in AttendanceGroupCard
  const groups = [
    { classification: 'Member', data: memberData },
    { classification: 'Family', data: familyData },
    { classification: 'Guest', data: guestData },
    { classification: 'Non-SDG', data: nonSdgData },
  ];

  return (
    <div className="container mx-auto mt-8">
      <AttendanceGroupCard groups={groups} />
    </div>
  );
};

export default AttendancePage;
