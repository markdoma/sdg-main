import { useEffect } from 'react';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import FormWithQRCode from '@/components/FormWithQRCode';
import PageHeading from '@/components/PageHeading';
import AttendanceSummaryReport from '@/components/AttendanceSummaryReport';
import AttendancePage from '@/components/AttendancePage';

import axios from 'axios';

//Context
import EventContext from '@/context/eventContext';

import { Fragment, useState } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
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
} from '@heroicons/react/24/outline';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';

export default function Summary() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eventsOptions, setEventsOptions] = useState([]);

  // const handleScan = (data) => {
  //   console.log("Scanned QR Code:", data);
  //   // Add your logic to handle the scanned QR code data here
  // };

  const [scanResult, setScanResult] = useState('');

  const handleScan = (data) => {
    setScanResult(data);
    // console.log("Scanned QR Code:", data);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/calendar/v3/calendars/ligayasdg@gmail.com/events`,
          {
            params: {
              key: 'AIzaSyC0OBwnEO2n244bIYqjhvTkdo1_QaZIjtY',
            },
          }
        );

        // Filter events that start with "SDG" or "Open"
        const filteredEvents = response.data.items.filter((item) => {
          const summary = item.summary.toLowerCase();
          return (
            summary.startsWith('sdg: district') ||
            summary.startsWith('open') ||
            summary.startsWith('beyond')
          );
        });

        // Filter events with dates between 07/30/23 and today's date
        const currentDate = new Date();
        const events = filteredEvents.map((item, index) => {
          let value;
          if (item.start.dateTime) {
            value = new Date(item.start.dateTime).toLocaleDateString('en-US');
          } else {
            value = new Date(item.start.date).toLocaleDateString('en-US');
          }

          // Parse the date string and compare it with the currentDate
          const eventDate = new Date(value);
          if (eventDate >= new Date('2023-07-29') && eventDate <= currentDate) {
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
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // const eventOptions = eventsOptions;

  // const eventOptions = [
  //   { value: '2023-07-30', label: 'July District Gathering' },
  //   { value: '2023-03-26', label: 'March District Gathering' },
  //   { value: '2023-08-06', label: 'August Open Door' },
  //   { value: '2023-08-04', label: 'Test Event' },
  // ];

  const [selectedEvent, setSelectedEvent] = useState(eventsOptions[0]);

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
              <EventContext.Provider value={[selectedEvent, setSelectedEvent]}>
                {/* {eventsOptions.length > 0 && ( // Add this conditional check
                  <PageHeading eventOptions />
                )} */}
                <PageHeading eventsOptions={eventsOptions} />

                {/* <AttendanceSummaryReport /> */}
                <AttendancePage />
              </EventContext.Provider>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
