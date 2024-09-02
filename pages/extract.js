import { useEffect } from "react";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import XLSX from "xlsx/dist/xlsx.full.min.js";

//Context
import EventContext from "@/context/eventContext";

import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { db } from "../utils/firebase";
import "firebase/firestore";

export default function Groupings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState([]);

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
    const unsubscribe = db
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

    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts
      unsubscribe();
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

  const downloadExcel = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // Get the current date in YYYY-MM-DD format
    const formattedTime = currentDate
      .toTimeString()
      .split(" ")[0]
      .replace(/:/g, ""); // Get the current time in HHMMSS format

    const filename = `ligaya_data_${formattedDate}_${formattedTime}.xlsx`; // Generate the filename with date and time

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ligaya Data");
    const excelBuffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });

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
      {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          {/* Sidebar overlay */}
          <Dialog
            as="div"
            className="fixed inset-0 z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            {/* Sidebar overlay background */}
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            {/* Sidebar panel */}
            <div className="fixed inset-0 flex">
              {/* Sidebar content */}
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  {/* Close button */}
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>

                  {/* Sidebar */}
                  <Sidebar />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar */}
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="lg:pl-72">
          {/* Header */}
          <Header />

          {/* Main section */}
          <main className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* <PageHeading evenstOptions="Hello" /> */}
              {/* <EventContext.Provider value={[selectedEvent, setSelectedEvent]}> */}
              {/* {eventsOptions.length > 0 && ( // Add this conditional check
                  <PageHeading eventOptions />
                )} */}
              {/* <PageHeading /> */}

              <button
                onClick={downloadExcel}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-xl mx-auto block"
              >
                Extract Members Data
              </button>
              {/* </EventContext.Provider> */}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}