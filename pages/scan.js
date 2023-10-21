import Header from '@/components/Header';

import Sidebar from '@/components/Sidebar';
import FormWithQRCode from '@/components/FormWithQRCode';
import Html5QrcodePlugin from '../components/Html5QrcodePlugin';
// import { getEventDetailsFromGoogleCalendar } from '../utils/attendance_utils';

import axios from 'axios';
import firebase, { db } from '../utils/firebase';

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

import { useRouter } from 'next/router';

export default function Scan() {
  const router = useRouter(); // Use useRouter hook for navigation
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [eventDetails, setEventDetails] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [qrData, setQRData] = useState(null);
  const [fullnameToDetailsMapping, setFullnameToDetailsMapping] = useState({});

  const [attendanceList, setAttendanceList] = useState([]);

  const [attendanceData, setAttendanceData] = useState([]);
  const [QRDetails, setQRDetails] = useState({
    qrDataId: null,
    sdgClass: null,
    pastoralLeader: null,
    firstname: null,
    lastname: null,
    no: null,
    invitedBy: null,
  });

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showExistingModal, setShowExistingModal] = useState(false);
  const [showNoRecordModal, setShowNoRecordModal] = useState(false);

  const getEventDetailsFromGoogleCalendar = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/ligayasdg@gmail.com/events`,
        {
          params: {
            // key: 'AIzaSyC0OBwnEO2n244bIYqjhvTkdo1_QaZIjtY',
            key: 'AIzaSyC0OBwnEO2n244bIYqjhvTkdo1_QaZIjtY',
          },
        }
      );
      const currentDate = new Date();
      // const data = await response.json();
      const data = response.data.items;
      const eventsForCurrentDay = data.filter((event) => {
        const eventDate = new Date(event.start.dateTime);

        return eventDate.toDateString() === currentDate.toDateString();
      });

      return eventsForCurrentDay.length > 0 ? eventsForCurrentDay[0] : null;
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

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

  useEffect(() => {
    // Deactivate scanner when component unmounts
    return () => {
      setScannerActive(false);
    };
  }, []);

  const onNewScanResult = (decodedText, decodedResult) => {
    // console.log(decodedText);
    if (decodedText) {
      setQRData(decodedText);

      checkDatabaseForAttendance(decodedText);
    }
  };

  const fetchMasterDataAndMappings = async () => {
    try {
      const masterDataRef = db.collection('master_data');
      const querySnapshot = await masterDataRef.get();

      let attendanceRecordExists = false;

      // Mapping to store other details for each fullname
      const newFullnameToDetailsMapping = {};

      querySnapshot.forEach((doc) => {
        const fullName = doc.data().firstname + ' ' + doc.data().lastname;
        newFullnameToDetailsMapping[fullName] = doc.data().doc_id;

        // Store other details in the fullnameToDetailsMapping
        newFullnameToDetailsMapping[fullName] = {
          id: doc.data().doc_id,
          sdg_class: doc.data().sdg_class,
          pastoral_leader: doc.data().pl,
          firstname: doc.data().firstname,
          lastname: doc.data().lastname,
          no: doc.data().no,
        };
      });

      // Now you have the mappings and can use them as needed
      // console.log(newFullnameToDetailsMapping);

      // Set the state with the new mapping
      setFullnameToDetailsMapping(newFullnameToDetailsMapping);
      // console.log(fullnameToDetailsMapping);
    } catch (error) {
      console.error('Error fetching master data and mappings: ', error);
    }
  };

  const checkDatabaseForAttendance = async (qrData) => {
    const fullName = qrData; // Replace with the actual fullname
    // console.log(fullName);
    // console.log(fullnameToDetailsMapping);

    if (!fullnameToDetailsMapping[fullName]) {
      // If the fullName does not exist in the mapping
      setShowNoRecordModal(true); // Show the "No Record" modal
      setQRDetails({
        firstname: qrData,
      });
      return;
    }
    const qrDataId = fullnameToDetailsMapping[fullName].id;
    const sdgClass = fullnameToDetailsMapping[fullName].sdg_class;
    const pastoralLeader = fullnameToDetailsMapping[fullName].pastoral_leader;
    const firstname = fullnameToDetailsMapping[fullName].firstname;
    const lastname = fullnameToDetailsMapping[fullName].lastname;
    const no = fullnameToDetailsMapping[fullName].no;
    const invitedBy = fullnameToDetailsMapping[fullName].invitedBy;
    // console.log(firstname);
    setQRDetails({
      qrDataId,
      sdgClass,
      pastoralLeader,
      firstname,
      lastname,
      no,
      invitedBy,
    });

    if (qrDataId !== undefined) {
      const eventDate = new Date(eventDetails.start.dateTime);
      const eventTimestamp = firebase.firestore.Timestamp.fromDate(eventDate);

      // console.log('with data');
      // Check if attendance already exists for the event and individual
      db.collectionGroup('attendance')
        .where('id', '==', qrDataId) // Use "id" as the query key
        .where('event', '==', eventDetails.summary)
        .where('date', '==', eventTimestamp)
        .get()
        .then((querySnapshot) => {
          // console.log(querySnapshot.empty);
          if (!querySnapshot.empty) {
            // Attendance already captured for this event and individual
            console.log(
              'Attendance already captured for this event and individual.'
            );
            setShowExistingModal(true); // Show the existing modal
          } else {
            // Attendance not captured, proceed to add new attendance
            // console.log(showConfirmationModal);

            setShowConfirmationModal(true); // Show the confirmation modal
            // console.log(`after - ${showConfirmationModal}`);
          }
        })
        .catch((error) => {
          console.error('Error checking attendance: ', error);
        });
    } else {
      console.log('No attendance record found for this event and individual.');
    }
  };

  const handleConfirmAttendance = () => {
    // Perform the attendance insertion logic here
    const newAttendance = {
      date: new Date(eventDetails.start.dateTime),
      event: eventDetails.summary,
      id: QRDetails.qrDataId, // Assuming there's only one matching doc
      no: QRDetails.no, // Use the "no" from the mapping
      firstname: QRDetails.firstname, // Assuming there's only one matching doc
      lastname: QRDetails.lastname, // Assuming there's only one matching doc
      pastoral_leader: QRDetails.pastoralLeader, // Assuming there's only one matching doc
      invitedBy: null,
      sdg_class: QRDetails.sdgClass, // Assuming there's only one matching doc
      first_timer: 'no',
    };

    // Add new attendance entry
    db.collection('master_data')
      .doc(QRDetails.qrDataId) // Assuming there's only one matching doc
      .collection('attendance')
      .add(newAttendance)
      .then((docRef) => {
        console.log('Attendance record added with ID: ', docRef.id);
        // Update attendance list with new data at the top
        setAttendanceList([newAttendance, ...attendanceList]);
        setQRData(null); // Reset QR data
      })
      .catch((error) => {
        console.error('Error adding attendance record: ', error);
      });
    // After successful insertion, close the confirmation modal
    setShowConfirmationModal(false);
    setQRData(null); // Reset QR data
    setScannerActive(true); // Reinitialize the scanner for another scan
  };

  const handleCancelConfirmation = () => {
    // User canceled the confirmation, so close the modal
    setShowConfirmationModal(false);
    setQRData(null); // Reset QR data
    setScannerActive(true); // Reinitialize the scanner for another scan
  };

  const handleNoRecordConfirmation = () => {
    // User canceled the confirmation, so close the modal
    setShowNoRecordModal(false);
    router.push('/attendance');
  };

  const handleExistingModalClose = () => {
    // Close the existing modal
    setShowExistingModal(false);
    setQRData(null); // Reset QR data
    setScannerActive(true);
  };

  useEffect(() => {
    // Add event listener for scanning results
    document.addEventListener('decoded', onNewScanResult);
    fetchMasterDataAndMappings();
    // console.log(fullnameToDetailsMapping);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('decoded', onNewScanResult);
    };
  }, []);

  return (
    <>
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
              <div className="flex justify-center">
                <button
                  className={`py-2 px-4 ${
                    scannerActive
                      ? 'bg-transparent'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white font-semibold rounded shadow-lg focus:outline-none`}
                  onClick={() => {
                    setScannerActive(!scannerActive);
                  }}
                >
                  {scannerActive ? '' : 'Activate Scanner'}
                </button>
              </div>

              {/* <button onClick={resetScanResult}>Reset Scan Result</button> */}
              {/* <Html5QrcodePlugin
                scannerActive={scannerActive}
                // scannerActive="True"
                fps={80}
                qrbox={500}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}
                onUnmount={() => setScannerActive(false)} // Deactivate scanner on unmount
              /> */}

              <div className="mx-auto max-w-md">
                <Html5QrcodePlugin
                  scannerActive={scannerActive}
                  fps={10}
                  aspectRatio={1.0}
                  qrbox={200}
                  disableFlip={false}
                  qrCodeSuccessCallback={onNewScanResult}
                  onUnmount={() => setScannerActive(false)} // Deactivate scanner on unmount
                />
              </div>

              {/* Display QR code data */}

              {/* Display QR code data */}
              {qrData && (
                <div>
                  <p>QR Code Data: {qrData}</p>
                </div>
              )}
              {/* {qrData && <p>QR Code Data: {qrData}</p>} */}
              {/* Confirmation Modal */}
              <Transition.Root show={showConfirmationModal} as={Fragment}>
                <Dialog
                  as="div"
                  className="fixed inset-0 z-50 overflow-y-auto"
                  onClose={handleCancelConfirmation}
                >
                  <div className="flex items-center justify-center min-h-screen px-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
                    </Transition.Child>

                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                        {/* Modal content */}
                        <div>
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                          >
                            Confirm Attendance
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              {`Do you want to add ${QRDetails.firstname} ${QRDetails.lastname} to the
                              attendance?`}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={handleConfirmAttendance}
                            className="px-4 py-2 mr-2 text-sm font-medium text-green-600 border border-transparent rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={handleCancelConfirmation}
                            className="px-4 py-2 text-sm font-medium text-red-600 border border-transparent rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </Transition.Child>
                  </div>
                </Dialog>
              </Transition.Root>

              {/* Existing Modal */}
              <Transition.Root show={showExistingModal} as={Fragment}>
                <Dialog
                  as="div"
                  className="fixed inset-0 z-50 overflow-y-auto"
                  onClose={handleExistingModalClose}
                >
                  <div className="flex items-center justify-center min-h-screen px-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                        {/* Modal content */}
                        <div>
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                          >
                            Record Already Exists
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              {`${QRDetails.firstname} ${QRDetails.lastname} already exists for this event.`}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={handleExistingModalClose}
                            className="px-4 py-2 text-sm font-medium text-blue-600 border border-transparent rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            OK
                          </button>
                        </div>
                      </div>
                    </Transition.Child>
                  </div>
                </Dialog>
              </Transition.Root>

              {/* No Record Modal */}
              <Transition.Root show={showNoRecordModal} as={Fragment}>
                <Dialog
                  as="div"
                  className="fixed inset-0 z-50 overflow-y-auto"
                  onClose={handleNoRecordConfirmation}
                >
                  <div className="flex items-center justify-center min-h-screen px-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                        {/* Modal content */}
                        <div>
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                          >
                            Record does not exists
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              {`Do you want ${QRDetails.firstname} to the database?`}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={handleNoRecordConfirmation}
                            className="px-4 py-2 text-sm font-medium text-blue-600 border border-transparent rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            OK
                          </button>
                        </div>
                      </div>
                    </Transition.Child>
                  </div>
                </Dialog>
              </Transition.Root>

              {/* Display attendance list */}
              {/* <div>
                <ul className="border rounded-md divide-y divide-gray-300">
                  {attendanceData
                    .slice()
                    .reverse() // Reverse the order of the array
                    .map((attendance, index) => (
                      <li key={index} className="p-4">
                        <div className="flex items-center">
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {attendance.firstname} {attendance.lastname}
                            </p>
                            <p className="text-sm text-gray-500">
                              {attendance.pastoral_leader} - Class:{' '}
                              {attendance.sdg_class}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div> */}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
