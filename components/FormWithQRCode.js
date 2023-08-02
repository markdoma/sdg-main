import { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../utils/firebase';
import axios from 'axios';

import Modal from '../components/Modal';

const FormWithQRCode = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDOB] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [invitedBy, setInvitedBy] = useState('');
  const [status, setStatus] = useState('');
  const [classification, setClassification] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [uniqueCode, setUniqueCode] = useState('');

  const [dummyData, setDummyData] = useState([]);
  const [members, setMembers] = useState([]);
  const [matchedNames, setMatchedNames] = useState([]);
  const [matchedInviter, setMatchedInviter] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  // New state variable to hold event details
  const [eventDetails, setEventDetails] = useState(null);
  // State when Present button is submitted - For those who are in the database
  const [isPresentButtonClicked, setIsPresentButtonClicked] = useState(false);
  // State when form is submitted
  const [isSaved, setIsSaved] = useState(false);

  // New state variable to track whether attendance is already captured for today's event
  const [isAttendanceCaptured, setIsAttendanceCaptured] = useState(false);

  // Function to retrieve event details from Google Calendar's event list for the current day

  const getEventDetailsFromGoogleCalendar = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/ligayasdg@gmail.com/events`,
        {
          params: {
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

  // Function to add a new attendance record to the "attendance" collection
  const addAttendanceRecord = (
    event,
    id,
    no,
    firstName,
    lastName,
    pl,
    invitedBy,
    sdg_class
  ) => {
    const newAttendanceRecord = {
      date: new Date(event.start.dateTime), // Replace with the actual event date from Google Calendar
      event: event.summary, // Replace with the actual event name from Google Calendar
      id: id,
      no: no,
      firstname: firstName.toLowerCase(),
      lastname: lastName.toLowerCase(),
      pastoral_leader: pl,
      invitedBy: invitedBy,
      sdg_class: sdg_class,
    };
    db.collection('master_data')
      .doc(id)
      .collection('attendance')
      // db.collection('attendance')
      .add(newAttendanceRecord)
      .then((docRef) => {
        console.log('Attendance record added with ID: ', docRef.id);
        // If you need to do anything after successfully adding the record, you can put it here.
      })
      .catch((error) => {
        console.error('Error adding attendance record: ', error);
      });

    setIsPresentButtonClicked(true);
  };

  useEffect(() => {
    // Check if attendance is already captured for today's event
    if (selectedName && eventDetails && eventDetails.start.dateTime) {
      const eventDateTime = new Date(eventDetails.start.dateTime);
      // console.log(eventDateTime);
      // console.log(isAttendanceCaptured);
      // Firestore query to check if a matching attendance record exists
      db.collection('attendance')
        .where('no', '==', selectedName.no)
        .where('date', '==', eventDateTime)
        .get()
        .then((querySnapshot) => {
          setIsAttendanceCaptured(!querySnapshot.empty);
        })
        .catch((error) => {
          console.error('Error checking attendance: ', error);
        });
    }
  }, [eventDetails, selectedName]);

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

  const handlePresentButtonClick = () => {
    // Add the attendance record when the "Present" button is clicked
    addAttendanceRecord(
      eventDetails,
      selectedName.doc_id,
      selectedName.no,
      selectedName.firstname,
      selectedName.lastname,
      selectedName.pl,
      null,
      selectedName.sdg_class
    );
  };

  useEffect(() => {
    const unsubscribe = db.collection('master_data').onSnapshot((snapshot) => {
      const fetchedMembers = snapshot.docs.map((doc) => doc.data());
      setMembers(fetchedMembers);
    });

    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts
      unsubscribe();
    };
  }, []);

  // Function to get the maximum "no" value from the "members" array
  const getMaxNoValue = () => {
    const maxNo = members.reduce((max, member) => {
      return member.no > max ? member.no : max;
    }, 0);
    return maxNo;
  };

  // New function to convert data to JSON format
  const convertToJSON = (firstName, lastName) => {
    return JSON.stringify({
      firstname: firstName,
      lastname: lastName,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert the data to JSON format using the new function
    const jsonData = convertToJSON(firstName, lastName);

    const generatedCode = uuidv4();
    setUniqueCode(generatedCode);
    setShowQRCode(true);
    setIsSaved(true);

    // Prepare the data to be saved in the database
    const newData = {
      no: getMaxNoValue() + 1,
      parent_no: null,
      lastname: lastName.toLowerCase(),
      firstname: firstName.toLowerCase(),
      middlename: null,
      suffix: null,
      nickname: null,
      gender: gender,
      birthdate: new Date(dob),
      street: address,
      brgy: null,
      city: null,
      province: null,
      region: null,
      civilstatus: status,
      bloodtype: null,
      weddingdate: null,
      contact: contact,
      emailadd: null,
      fathersname: null,
      mothersname: null,
      profession_course: null,
      company_school: null,
      cwryear: null,
      entry: null,
      sdg_class: classification,
      status: null,
      pl: null,
      service_role: null,
      ligaya: null,
      chrurch: null,
      lat: null,
      long: null,
      qrCode: jsonData,
      insert_date: new Date(),
      insert_by: 'Reg Team',
      update_date: null,
      update_by: null,
      invitedBy: invitedBy,
    };

    // Add the data to the "master" collection in the database
    db.collection('master_data')
      .add(newData)
      .then((docRef) => {
        console.log('Document written with ID: ', docRef.id);
        // If you need to do anything after successfully adding the record, you can put it here.
        setIsSaved(true);
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });

    // Call addAttendanceRecord with pastoral_leader set to "Guest"
    addAttendanceRecord(
      eventDetails,
      newData.no,
      newData.firstname,
      newData.lastname,
      'Guest',
      newData.invitedBy,
      newData.classification
    );
  };

  const handleModalClose = () => {
    // Handle form reset and modal close
    setIsSaved(false);
    resetForm();
  };

  const handleFirstNameChange = (e) => {
    const inputFirstName = e.target.value;
    setFirstName(inputFirstName);

    setSelectedName(null);

    if (inputFirstName.trim() === '') {
      setMatchedNames([]); // Clear the matched names list if the input is empty
    } else {
      const matched = members.filter((record) =>
        record.firstname.toLowerCase().includes(inputFirstName.toLowerCase())
      );
      setMatchedNames(
        matched.map((record) => `${record.firstname} ${record.lastname}`)
      );
      setSelectedName(null);
    }
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    setSelectedName(null);
  };

  const handleInvitedByChange = (e) => {
    const inputInvitedBy = e.target.value;
    setInvitedBy(inputInvitedBy);

    if (inputInvitedBy.trim() === '') {
      setMatchedInviter([]); // Clear the matched names list if the input is empty
    } else {
      const matched = members.filter((record) =>
        record.firstname.toLowerCase().includes(inputInvitedBy.toLowerCase())
      );
      setMatchedInviter(
        matched.map((record) => `${record.firstname} ${record.lastname}`)
      );
    }
  };

  const handleSelectInviter = (selectedInviter) => {
    setInvitedBy(selectedInviter);
    setMatchedInviter([]); // Clear the matched names list after selection
  };

  const handleMatchedNameClick = (selectedName) => {
    // console.log(selectedName);
    const matchedRecord = members.find((record) => {
      const fullName = `${record.firstname} ${record.lastname}`.toLowerCase();
      return fullName === selectedName.toLowerCase();
    });

    // console.log(matchedRecord);

    if (matchedRecord) {
      setFirstName(matchedRecord.firstname);
      setLastName(matchedRecord.lastname);
      setMatchedNames([]);
      setSelectedName(matchedRecord);
      setShowQRCode(true);
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setDOB('');
    setGender('');
    setContact('');
    setAddress('');
    setInvitedBy('');
    setStatus('');
    setClassification('');
    setSelectedName(null);
    setShowQRCode(false);
    setUniqueCode('');
    setIsSaved(false);
  };

  return (
    <div className="flex justify-center items-start h-screen">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            {/* <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="firstName"
            >
              First Name
            </label> */}
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="firstName"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={handleFirstNameChange}
              required
              autoComplete="off"
            />

            {firstName.trim().length >= 3 && matchedNames.length > 0 && (
              <ul className="mt-2 p-2 border border-gray-300 bg-gray-100 rounded-md">
                {matchedNames.map((matchedName, index) => (
                  <li
                    key={index}
                    className="cursor-pointer py-1 hover:bg-gray-200 flex items-center justify-between"
                    onClick={() => handleMatchedNameClick(matchedName)}
                  >
                    <span>{matchedName}</span>
                    <span className="italic text-xs text-red-500">matched</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {selectedName ? (
            <>
              <div className="flex flex-col mb-4">
                <p>
                  <span className="font-bold">Name:</span>{' '}
                  <span className="font-italic">
                    {`${selectedName.firstname} ${selectedName.lastname}`}
                  </span>
                </p>
                <p>
                  <span className="font-bold">Pastoral Leader:</span>{' '}
                  <span className="font-italic">
                    {selectedName.pl ? selectedName.pl : 'N/A'}
                  </span>
                </p>
                <p>
                  <span className="font-bold">Today's Event:</span>{' '}
                  <span className="font-italic">
                    {eventDetails ? eventDetails.summary : 'No event for today'}
                  </span>
                </p>
                <p>
                  <span className="font-bold">Date:</span>{' '}
                  <span className="font-italic">
                    {eventDetails
                      ? new Date(
                          eventDetails.start.dateTime
                        ).toLocaleDateString()
                      : 'No event for today'}
                  </span>
                </p>
              </div>
              {/* Conditionally render the "Present" button */}
              {eventDetails && !isAttendanceCaptured && (
                <div className="flex justify-center items-center">
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={handlePresentButtonClick}
                  >
                    I'm Here!
                  </button>
                </div>
              )}

              {/* Render attendance message when attendance is already captured */}
              {isAttendanceCaptured && eventDetails && eventDetails.summary && (
                <div className="bg-white rounded-lg shadow-lg p-4 mt-4 text-center border border-red-100">
                  <p className="text-xl font-blue-100 font-italic">
                    We have already recorded your attendance for today's event!
                  </p>
                </div>
              )}
              {/* <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="qrCode"
                >
                  Assigned QR Code
                </label>

                <QRCode value="{name: Mark Jayson, id: 1234}" size={256} />
              </div> */}
            </>
          ) : (
            <>
              <div className="mb-4">
                {/* <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="lastName"
                >
                  Last Name
                </label> */}
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={handleLastNameChange}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="mb-4">
                {/* <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="status"
                >
                  Status
                </label> */}
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  autoComplete="off"
                >
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="kids">Kids</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="dob"
                >
                  Date of Birth
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="dob"
                  type="date"
                  placeholder="Date of Birth"
                  value={dob}
                  onChange={(e) => setDOB(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="mb-4">
                {/* <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="gender"
                >
                  Gender
                </label> */}
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-blue-500"
                      name="gender"
                      value="Male"
                      checked={gender === 'Male'}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <span className="text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-pink-500"
                      name="gender"
                      value="Female"
                      checked={gender === 'Female'}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <span className="text-gray-700">Female</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                {/* <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="contact"
                >
                  Contact No.
                </label> */}
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="contact"
                  type="text"
                  placeholder="Contact No."
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="mb-4">
                {/* <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="address"
                >
                  Address
                </label> */}
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="address"
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>

              <div className="mb-4">
                {/* <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="invitedBy"
                >
                  Invited By
                </label> */}
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="invitedBy"
                  type="text"
                  placeholder="Invited By"
                  value={invitedBy}
                  onChange={handleInvitedByChange}
                  required
                  autoComplete="off"
                />
                {matchedInviter.length > 0 && invitedBy.trim() !== '' && (
                  <ul className="mt-2 p-2 border border-gray-300 bg-gray-100 rounded-md">
                    {matchedInviter.map((matchedName, index) => (
                      <li
                        key={index}
                        className="cursor-pointer py-1 hover:bg-gray-200 flex items-center justify-between"
                        onClick={() => handleSelectInviter(matchedName)}
                      >
                        <span>{matchedName}</span>
                        <span className="italic text-xs text-red-500">
                          matched
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mb-8 border border-green-500 p-4 rounded-lg">
                <div className="mb-4">
                  {/* <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="classification"
                  >
                    Classification
                  </label> */}
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="classification"
                    value={classification}
                    onChange={(e) => setClassification(e.target.value)}
                    required
                  >
                    <option value="">Select Classification</option>
                    <option value="LNP Member SDG">LNP Member SDG</option>
                    <option value="LNP Member SDG - Family">
                      LNP Member SDG - Family
                    </option>
                    <option value="LNP Member Non-SDG">
                      LNP Member Non-SDG
                    </option>
                    <option value="Non-LNP-Guest">Non-LNP-Guest</option>
                  </select>
                </div>
                <p className="text-sm text-gray-600 italic">
                  This section should be filled by the registration team.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
        {/* Render the modal when isSubmitted is true or isPresentButtonClicked is true */}
        {(isSaved || isPresentButtonClicked) && (
          <Modal
            onClose={() => {
              setIsPresentButtonClicked(false); // Reset isPresentButtonClicked to false when modal is closed
              setIsSaved(false);
              resetForm();
            }}
            eventSummary={eventDetails ? eventDetails.summary : ''}
            name={selectedName ? selectedName.firstname : ''}
            // eventSummary={eventDetails ? eventDetails.summary : ""}
          />
        )}
      </div>
    </div>
  );
};

export default FormWithQRCode;
