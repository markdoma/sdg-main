import { useEffect } from "react";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import FormWithQRCode from "@/components/FormWithQRCode";
import PageHeading from "@/components/PageHeading";
import AttendanceSummaryReport from "@/components/AttendanceSummaryReport";
import AttendancePage from "@/components/AttendancePage";

import axios from "axios";

//Context
import EventContext from "@/context/eventContext";

import { Fragment, useState } from "react";
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

// const calEvents = [
//   { date: '2023-12-02', eventName: 'Open Door' },
//   { date: '2023-12-15', eventName: 'Event 2' },
//   { date: '2023-12-20', eventName: 'Event 3' },
// ];

export default function Summary() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eventsOptions, setEventsOptions] = useState([]);

  // const handleScan = (data) => {
  //   console.log("Scanned QR Code:", data);
  //   // Add your logic to handle the scanned QR code data here
  // };

  const [scanResult, setScanResult] = useState("");

  const handleScan = (data) => {
    setScanResult(data);
    // console.log("Scanned QR Code:", data);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/calendar/v3/calendars/ligayasdg@gmail.com/events/`,
          {
            params: {
              // key: 'AIzaSyC0OBwnEO2n244bIYqjhvTkdo1_QaZIjtY',
              key: "AIzaSyAbX2qOg-8MGiK2HHxpNT0DAwCogdHpJJM",
            },
          }
        );

        // Filter events that start with "SDG" or "Open"
        const filteredEvents = response.data.items.filter((item) => {
          if (item.status === "cancelled") {
            // Exclude cancelled events
            return false;
          }
          const summary = item.summary.toLowerCase();
          return (
            summary.startsWith("sdg: district") ||
            summary.startsWith("open") ||
            summary.startsWith("bid") ||
            summary.startsWith("choices") ||
            summary.startsWith("plt")
          );
        });

        // Filter events with dates between 07/30/23 and today's date
        const currentDate = new Date();
        const events = filteredEvents.map((item, index) => {
          if (item.status === "cancelled") {
            // Exclude cancelled events
            return false;
          }
          let value;
          if (item.start.dateTime) {
            value = new Date(item.start.dateTime).toLocaleDateString("en-US");
          } else {
            value = new Date(item.start.date).toLocaleDateString("en-US");
          }

          // Parse the date string and compare it with the currentDate
          const eventDate = new Date(value);
          if (eventDate >= new Date("2023-07-29") && eventDate <= currentDate) {
            return {
              value,
              label: item.summary,
              key: `${value}-${index}`,
            };
          }
          return null;
        });

        // Remove null values from the events array (events that didn't meet the criteria)
        const filteredEventsOptions = events.filter(Boolean);

        setEventsOptions(filteredEventsOptions);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const eventOptions = eventsOptions;

  // const eventOptions = [
  //   { value: '2023-07-30', label: 'July District Gathering' },
  //   { value: '2023-03-26', label: 'March District Gathering' },
  //   { value: '2023-08-06', label: 'August Open Door' },
  //   { value: '2023-08-04', label: 'Test Event' },
  // ];

  // const [selectedEvent, setSelectedEvent] = useState(eventsOptions[0]);
  const [selectedEvent, setSelectedEvent] = useState(eventOptions[0]);

  console.log(selectedEvent);

  return (
    <>
      <EventContext.Provider value={[selectedEvent, setSelectedEvent]}>
        {/* {eventsOptions.length > 0 && ( // Add this conditional check
                  <PageHeading eventOptions />
                )} */}
        {/* <PageHeading eventsOptions={eventsOptions} /> */}

        {/* <AttendanceSummaryReport /> */}
        <AttendancePage />
      </EventContext.Provider>
    </>
  );
}
