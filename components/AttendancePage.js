import React, { useEffect, useState, useContext } from "react";
import { db } from "../utils/firebase"; // Replace this with your Firebase configuration
import AttendanceGroupCard from "./AttendanceGroupCard"; // Make sure to adjust the path if necessary
import EventContext from "@/context/eventContext";

import {
  collectionGroup,
  onSnapshot,
  collection,
  getDocs,
} from "firebase/firestore";

import EventOptions from "../components/EventOptions";

import { Timestamp } from "firebase/firestore";

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [masterData, setMasterData] = useState({});

  const [eventsOptions, setEventsOptions] = useState([]);

  console.log(`${eventsOptions} from attendance page`);
  console.log(eventsOptions);

  const eventOptions = eventsOptions;

  const [selectedEvent, setSelectedEvent] = useState(eventOptions[0]);

  console.log(selectedEvent);

  // console.log(selectedEvent);

  // Define groups outside useEffect
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // Fetch all attendance data from collectionGroup
    const unsubscribe = onSnapshot(
      collectionGroup(db, "attendance"),
      (snapshot) => {
        const fetchedAttendance = snapshot.docs.map((doc) => doc.data());
        // Convert Firestore timestamps to JavaScript Date objects
        const processedAttendanceData = fetchedAttendance.map((item) => ({
          ...item,
          date: item.date.toDate().toLocaleDateString("en-US"), // Assuming 'date' is the field with the timestamp
        }));
        setAttendanceData(processedAttendanceData);
      }
    );

    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Fetch data from master_data collection only once
    const fetchMasterData = async () => {
      const masterDataSnapshot = await getDocs(collection(db, "master_data"));
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

  useEffect(() => {
    // Filter attendanceData based on the selected eventOptions
    // Define the target date: September 1, 2024
    const targetDate = new Date("2025-02-01T00:00:00.000Z");
    const convertedDate = new Date(targetDate);
    console.log(convertedDate);
    const filteredAttendanceData = attendanceData.filter(
      // (item) => item.date === selectedEvent[0]
      (item) => item.date === new Date(targetDate).toLocaleDateString("en-US")
      // (item) => item.event === "Beyond I Do" //this is just temporary for this event only!!!!
      //   (item) =>
      //     new Date(item.date) ===
      //     firebase.firestore.Timestamp.fromDate(targetDate)
    );

    // console.log(selectedEvent[0]);

    // Map the fetched master_data to the filtered attendanceData
    const processedAttendanceData = filteredAttendanceData.map(
      (attendanceItem) => {
        const masterDataItem = masterData[attendanceItem.id] || {};
        return {
          ...attendanceItem,
          birthdate: masterDataItem.birthdate || null,
          gender: masterDataItem.gender || null,
          civilstatus: masterDataItem.civilstatus || null,
          // Add other fields from masterDataItem if needed
        };
      }
    );

    // Group the attendance data based on the presence of a pastoral leader
    const memberData = processedAttendanceData.filter(
      (item) => item.sdg_class === "LNP Member SDG"
    );

    // Group the attendance data based on sdg_class field
    const familyData = processedAttendanceData.filter(
      (item) => item.sdg_class === "LNP Member SDG - Family"
    );
    const guestData = processedAttendanceData.filter(
      (item) => item.sdg_class === "Non-LNP-Guest"
    );
    const nonSdgData = processedAttendanceData.filter(
      (item) => item.sdg_class === "LNP Member Non-SDG"
    );

    // Prepare an array of groups to be rendered in AttendanceGroupCard
    const updatedGroups = [
      { classification: "Member", data: memberData },
      { classification: "Family", data: familyData },
      { classification: "Guest", data: guestData },
      { classification: "Non-SDG", data: nonSdgData },
    ];

    console.log(groups);
    // You can now use 'groups' as needed in your component.

    // Update the groups using setGroups
    setGroups(updatedGroups);

    // Render the AttendanceGroupCard or other components using 'groups' data
  }, [attendanceData, selectedEvent, masterData]);

  return (
    <div className="container mx-auto mt-8">
      {/* <EventOptions eventsOptions={eventsOptions} /> */}
      <AttendanceGroupCard groups={groups} />
    </div>
  );
};

export default AttendancePage;
