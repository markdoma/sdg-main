import { useState } from 'react';
import QrReader from 'react-qr-reader';
import { db } from '../utils/firebase';
import { getEventDetailsFromGoogleCalendar } from '../utils/attendance_utils';

const QRCodeScanner = () => {
  const [qrData, setQRData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  // New state variable to hold event details
  const [eventDetails, setEventDetails] = useState(null);

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

  const handleScan = (data) => {
    if (eventDetails.isEmpty()) {
      Alert('No event!');
    }
    if (data) {
      setQRData(data);
      checkDatabaseForAttendance(data);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const checkDatabaseForAttendance = async (qrData) => {
    const [qrFirstName, qrLastName] = qrData.split(' ');

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

      if (fullName === qrData && !eventDetails.isEmpty()) {
        // Insert attendance record and reset QR settings
        const attendanceRef = doc.ref.collection('attendance');
        attendanceRef.add({
          eventDetails,
          doc_id,
          no,
          firstName,
          lastName,
          pl,
          invitedBy: null,
          sdg_class,
          first: 'no',
        });

        // TODO: Reset QR settings
      }
    });

    // No record found, show modal
    setModalVisible(true);
  };

  // TODO: Implement reset QR settings logic

  return (
    <div>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      {/* TODO: Render modal if modalVisible is true */}
    </div>
  );
};

export default QRCodeScanner;
