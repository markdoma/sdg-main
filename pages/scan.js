import Header from '@/components/Header';

import Sidebar from '@/components/Sidebar';
import FormWithQRCode from '@/components/FormWithQRCode';
import Html5QrcodePlugin from '../components/Html5QrcodePlugin';
import { getEventDetailsFromGoogleCalendar } from '../utils/attendance_utils';
import { db } from '../utils/firebase';

import { Fragment, useState, useEffect } from 'react';
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

export default function Sample() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [qrData, setQRData] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);

  // const handleScan = (data) => {
  //   console.log("Scanned QR Code:", data);
  //   // Add your logic to handle the scanned QR code data here

  useEffect(() => {
    // Fetch event details from Google Calendar when the component mounts
    getEventDetailsFromGoogleCalendar()
      .then((event) => {
        setEventDetails(event);
      })
      .catch((error) => {
        console.error('Error fetching event details: ', error);
      });
  }, []);
  // };

  const onNewScanResult = (decodedText, decodedResult) => {
    // handle decoded results here
    // if (eventDetails.isEmpty()) {
    //   Alert('No event!');
    // }
    if (decodedText) {
      setQRData(decodedText);
      checkDatabaseForAttendance(decodedText);
    }
    html5QrcodeScanner.clear();
    // alert(decodedText);
  };

  const checkDatabaseForAttendance = async (qrData) => {
    // const [qrFirstName, qrLastName] = qrData.split(' ');

    // Query Firestore to fetch all documents
    const masterDataRef = db.collection('master_data');
    const querySnapshot = await masterDataRef.get();

    // Loop through the documents and compare concatenated name with qrData
    querySnapshot.forEach((doc) => {
      const firstName = doc.data().firstname;
      const lastName = doc.data().lastname;
      const doc_id = doc.data().doc_id;
      const no = doc.data().no;
      const pl = doc.data().pl;
      const sdg_class = doc.data().sdg_class;
      const fullName = firstName + ' ' + lastName;

      if (fullName === qrData) {
        // Insert attendance record and reset QR settings
        const attendanceRef = doc.ref.collection('attendance');
        attendanceRef.add({
          event: eventDetails,
          // event: 'test',
          id: doc_id,
          no,
          firstname: firstName,
          lastname: lastName,
          pl,
          invitedBy: null,
          sdg_class,
          first: 'no',
        });

        alert(`Successfully Added! ${firstName} ${lastName}`);

        // TODO: Reset QR settings
      }
    });

    // No record found, show modal
    // setModalVisible(true);
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
              <div>Back</div>

              {/* <button onClick={resetScanResult}>Reset Scan Result</button> */}
              <Html5QrcodePlugin
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
