import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase'; // Replace this with your Firebase configuration
import AttendanceGroupCard from './AttendanceGroupCard'; // Make sure to adjust the path if necessary

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [masterData, setMasterData] = useState({});

  useEffect(() => {
    // Fetch all attendance data from collectionGroup
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

  useEffect(() => {
    // Fetch data from master_data collection only once
    const fetchMasterData = async () => {
      const masterDataSnapshot = await db.collection('master_data').get();
      const masterDataList = masterDataSnapshot.docs.map((doc) => doc.data());
      // Convert masterDataList to an object with the document ID as keys for efficient lookup
      const masterDataObject = masterDataList.reduce((acc, data) => {
        // Ensure each document in master_data has a 'doc_id' field
        if (data.doc_id) {
          acc[data.doc_id] = data;
        }
        return acc;
      }, {});
      setMasterData(masterDataObject);
    };

    fetchMasterData();
  }, []);

  // Map the fetched master_data to the attendanceData
  const processedAttendanceData = attendanceData.map((attendanceItem) => {
    const masterDataItem = masterData[attendanceItem.id] || {};
    return {
      ...attendanceItem,
      birthdate: masterDataItem.birthdate || null,
      // Add other fields from masterDataItem if needed
    };
  });
  console.log(processedAttendanceData);

  // Group the attendance data based on the presence of a pastoral leader
  const memberData = processedAttendanceData.filter(
    (item) => item.sdg_class === 'LNP Member SDG'
  );

  // Group the attendance data based on sdg_class field
  const familyData = processedAttendanceData.filter(
    (item) => item.sdg_class === 'LNP Member SDG - Family'
  );
  const guestData = processedAttendanceData.filter(
    (item) => item.sdg_class === 'Non-LNP-Guest'
  );
  const nonSdgData = processedAttendanceData.filter(
    (item) => item.sdg_class === 'LNP Member Non-SDG'
  );

  console.log(familyData);
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