import { useEffect } from "react";

// import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import XLSX from "xlsx/dist/xlsx.full.min.js";

//Context
import EventContext from "@/context/eventContext";

import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { db } from "../utils/firebase";
import "firebase/firestore";

export default function Extract() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  // useEffect(() => {
  //   // Function to fetch data from Firebase
  //   const fetchData = async () => {
  //     try {
  //       const collectionRef = db.collection("master_data");
  //       const snapshot = await collectionRef.get();
  //       const fetchedData = snapshot.docs.map((doc) => {
  //         const data = doc.data();
  //         // Convert timestamp fields to Date objects
  //         for (const key in data) {
  //           if (data[key] instanceof Timestamp) {
  //             data[key] = data[key].toDate().toLocaleDateString("en-US");
  //           }
  //         }
  //         return {
  //           id: doc.id,
  //           ...data,
  //         };
  //       });
  //       setData(fetchedData);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   // Call the fetch function
  //   fetchData();
  // }, []);

  useEffect(() => {
    // Fetch all attendance data from collectionGroup
    const unsubscribeMasterData = db
      .collectionGroup("master_data")
      .onSnapshot((snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => doc.data());
        // Convert Firestore timestamps to JavaScript Date objects
        const processedMasterData = fetchedData.map((item) => {
          const processedItem = { ...item };
          // Check if dates are not null before converting
          if (processedItem.weddingdate)
            processedItem.weddingdate = processedItem.weddingdate
              .toDate()
              .toLocaleDateString("en-US");
          if (processedItem.birthdate)
            processedItem.birthdate = processedItem.birthdate
              .toDate()
              .toLocaleDateString("en-US");
          if (processedItem.update_date)
            processedItem.update_date = processedItem.update_date
              .toDate()
              .toLocaleDateString("en-US");
          if (processedItem.insert_date)
            processedItem.insert_date = processedItem.insert_date
              .toDate()
              .toLocaleDateString("en-US");
          return processedItem;
        });
        setData(processedMasterData);
      });
    // Fetch all attendance data from collectionGroup
    const unsubscribeAttendanceData = db
      .collectionGroup("attendance")
      .onSnapshot((snapshot) => {
        const fetchedAttendanceData = snapshot.docs.map((doc) => doc.data());

        const processedAttendanceData = fetchedAttendanceData.map((item) => {
          const processedItem = { ...item };
          if (processedItem.date)
            processedItem.date = processedItem.date
              .toDate()
              .toLocaleDateString("en-US");
          return processedItem;
        });

        setAttendanceData(processedAttendanceData);
      });
    return () => {
      // Unsubscribe from the snapshot listeners when the component unmounts
      unsubscribeMasterData();
      unsubscribeAttendanceData();
    };
  }, []);

  // const downloadExcel = () => {
  //   console.log(data);
  //   const ws = XLSX.utils.json_to_sheet(data);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Ligaya SDG Data");
  //   const excelBuffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });

  //   const blob = new Blob([excelBuffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });
  //   const href = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = href;
  //   link.download = "firebase_data.xlsx";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  // const downloadExcel = () => {
  //   const currentDate = new Date();
  //   const formattedDate = currentDate.toISOString().split("T")[0]; // Get the current date in YYYY-MM-DD format
  //   const formattedTime = currentDate
  //     .toTimeString()
  //     .split(" ")[0]
  //     .replace(/:/g, ""); // Get the current time in HHMMSS format

  //   const filename = `ligaya_data_${formattedDate}_${formattedTime}.xlsx`; // Generate the filename with date and time

  //   const ws = XLSX.utils.json_to_sheet(data);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Ligaya Data");

  //   const excelBuffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });

  //   const blob = new Blob([excelBuffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });
  //   const href = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = href;
  //   link.download = filename; // Set the filename for download
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const downloadExcel = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // Get the current date in YYYY-MM-DD format
    const formattedTime = currentDate
      .toTimeString()
      .split(" ")[0]
      .replace(/:/g, ""); // Get the current time in HHMMSS format

    const filename = `ligaya_data_${formattedDate}_${formattedTime}.xlsx`; // Generate the filename with date and time

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Add the master data sheet
    const wsMaster = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, wsMaster, "Ligaya Data");

    // Add the attendance data sheet
    const wsAttendance = XLSX.utils.json_to_sheet(attendanceData);
    XLSX.utils.book_append_sheet(wb, wsAttendance, "Attendance");

    // Write the workbook to a buffer
    const excelBuffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });

    // Create a blob from the buffer
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = filename; // Set the filename for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Main section */}
      <main className="py-10">
        <button
          onClick={downloadExcel}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-xl mx-auto block"
        >
          Extract Members Data
        </button>
      </main>
    </>
  );
}
