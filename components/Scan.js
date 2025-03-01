import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Html5QrcodePlugin from "../components/Html5QrcodePlugin";
import { db } from "../utils/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore"; // v9 modular imports
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import eventDetailsData from "../data/eventDetails"; // Import static event data

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

  useEffect(() => {
    // Set static event details if the current date matches the event date
    const currentDate = new Date().toISOString().split("T")[0];
    const event = eventDetailsData.find(
      (event) => event.EventDate === currentDate
    );
    setEventDetails(event || null);
  }, []);

  useEffect(() => {
    // Deactivate scanner when component unmounts
    return () => {
      setScannerActive(false);
    };
  }, []);

  const onNewScanResult = (decodedText, decodedResult) => {
    if (decodedText) {
      setQRData(decodedText);
      checkDatabaseForAttendance(decodedText);
    }
  };

  const fetchMasterDataAndMappings = async () => {
    try {
      const masterDataRef = collection(db, "master_data");
      const querySnapshot = await getDocs(masterDataRef);

      // Mapping to store other details for each fullname
      const newFullnameToDetailsMapping = {};

      querySnapshot.forEach((doc) => {
        const fullName = doc.data().firstname + " " + doc.data().lastname;
        newFullnameToDetailsMapping[fullName] = {
          id: doc.id,
          sdg_class: doc.data().sdg_class,
          pastoral_leader: doc.data().pl,
          firstname: doc.data().firstname,
          lastname: doc.data().lastname,
          no: doc.data().no,
          invitedBy: doc.data().invitedBy,
        };
      });

      // Set the state with the new mapping
      setFullnameToDetailsMapping(newFullnameToDetailsMapping);
    } catch (error) {
      console.error("Error fetching master data and mappings: ", error);
    }
  };

  const checkDatabaseForAttendance = async (qrData) => {
    const fullName = qrData;

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
      const eventDate = new Date(eventDetails.EventDate);

      // Check if attendance already exists for the event and individual
      const attendanceQuery = query(
        collection(db, `master_data/${qrDataId}/attendance`),
        where("event", "==", eventDetails.Summary),
        where("date", "==", eventDate)
      );

      const querySnapshot = await getDocs(attendanceQuery);

      if (!querySnapshot.empty) {
        // Attendance already captured for this event and individual
        setShowExistingModal(true); // Show the existing modal
      } else {
        // Attendance not captured, proceed to add new attendance
        setShowConfirmationModal(true); // Show the confirmation modal
      }
    } else {
      console.log("No attendance record found for this event and individual.");
    }
  };

  const handleConfirmAttendance = () => {
    // Perform the attendance insertion logic here
    const newAttendance = {
      date: new Date(eventDetails.EventDate),
      event: eventDetails.Summary,
      id: QRDetails.qrDataId,
      no: QRDetails.no,
      firstname: QRDetails.firstname,
      lastname: QRDetails.lastname,
      pastoral_leader: QRDetails.pastoralLeader,
      invitedBy: QRDetails.invitedBy,
      sdg_class: QRDetails.sdgClass,
      first_timer: "no",
    };

    // Add new attendance entry
    addDoc(
      collection(db, `master_data/${QRDetails.qrDataId}/attendance`),
      newAttendance
    )
      .then((docRef) => {
        console.log("Attendance record added with ID: ", docRef.id);
        // Update attendance list with new data at the top
        setAttendanceList([newAttendance, ...attendanceList]);
        setQRData(null); // Reset QR data
      })
      .catch((error) => {
        console.error("Error adding attendance record: ", error);
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
    router.push("/attendance");
  };

  const handleExistingModalClose = () => {
    // Close the existing modal
    setShowExistingModal(false);
    setQRData(null); // Reset QR data
    setScannerActive(true);
  };

  useEffect(() => {
    // Add event listener for scanning results
    document.addEventListener("decoded", onNewScanResult);
    fetchMasterDataAndMappings();

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("decoded", onNewScanResult);
    };
  }, []);

  return (
    <>
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <button
              className={`py-2 px-4 ${
                scannerActive
                  ? "bg-transparent"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white font-semibold rounded shadow-lg focus:outline-none`}
              onClick={() => {
                setScannerActive(!scannerActive);
              }}
            >
              {scannerActive ? "" : "Activate Scanner"}
            </button>
          </div>

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
          {qrData && (
            <div>
              <p>QR Code Data: {qrData}</p>
            </div>
          )}

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
                        Record does not exist
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {`Do you want ${QRDetails.firstname} to be added to the database?`}
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
        </div>
      </main>
    </>
  );
}
