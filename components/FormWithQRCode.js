import { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../utils/firebase';
import axios from 'axios';

import Modal from '../components/Modal';
import FormConfirmationModal from '../components/FormConfirmationModal';

import {
  getEventDetailsFromGoogleCalendar,
  capitalizeName,
} from '../utils/attendance_utils';

const FormWithQRCode = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDOB] = useState('');
  const [gender, setGender] = useState('Male');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [invitedBy, setInvitedBy] = useState('');
  const [status, setStatus] = useState('');
  const [first, setFirst] = useState('yes');
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
  // State when form is confirmed
  const [isConfirmed, setIsConfirmed] = useState(false);

  // New state variable to track whether attendance is already captured for today's event
  const [isAttendanceCaptured, setIsAttendanceCaptured] = useState(false);

  // Modals
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleConfirmationModalConfirm = () => {
    // Handle the form submission here after the user confirms the information
    setShowConfirmationModal(false);
    setIsConfirmed(true);
    // Convert the data to JSON format using the new function
    const jsonData = convertToJSON(firstName, lastName);

    const generatedCode = uuidv4();
    setUniqueCode(generatedCode);
    setShowQRCode(true);

    // Prepare the data to be saved in the database
    const newData = {
      no: getMaxNoValue() + 1,
      parent_no: null,
      lastname: capitalizeName(lastName),
      firstname: capitalizeName(firstName),
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

    // Add the data to the "master_data" collection in the database
    db.collection('master_data')
      .add(newData)
      .then((docRef) => {
        console.log('Document written with ID: ', docRef.id);

        // Update the newData object with the doc_id
        newData.doc_id = docRef.id;

        // Add the attendance record when the "Present" button is clicked
        addAttendanceRecord(
          eventDetails,
          newData.doc_id,
          newData.no,
          newData.firstname,
          newData.lastname,
          newData.pl,
          newData.invitedBy,
          newData.sdg_class,
          first
        );

        // Update the "master_data" collection with the doc_id property
        db.collection('master_data')
          .doc(docRef.id)
          .update({ doc_id: docRef.id })
          .then(() => {
            console.log('Document updated with doc_id: ', docRef.id);
          })
          .catch((error) => {
            console.error('Error updating document with doc_id: ', error);
          });
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  };

  const handleConfirmationModalClose = () => {
    // Hide the confirmation modal when the user clicks on "Edit"
    setShowConfirmationModal(false);
  };
  const getEventDetailsFromGoogleCalendar = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/ligayasdg@gmail.com/events/`,
        {
          params: {
            // key: 'AIzaSyC0OBwnEO2n244bIYqjhvTkdo1_QaZIjtY',
            key: 'AIzaSyAbX2qOg-8MGiK2HHxpNT0DAwCogdHpJJM',
          },
        }
      );
      const currentDate = new Date();
      // const data = await response.json();
      const data = response.data.items;
      console.log(currentDate)
      console.log(data)
      const eventsForCurrentDay = data.filter((event) => {
       

        if (event.status === 'cancelled') {
          // Exclude cancelled events
          return false;
      }

      // console.log(event)
        const summary = event.summary.toLowerCase()
        const eventDate = new Date(event.start.dateTime);
        // return eventDate.toDateString() === currentDate.toDateString();
        return (
          eventDate.toDateString() === currentDate.toDateString() &&
           (event.summary.startsWith('sdg: district') ||
            event.summary.startsWith('Open') ||
            event.summary.startsWith('beyond'))
        );
      });
      console.log(eventsForCurrentDay);

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
    sdg_class,
    first
  ) => {
    const newAttendanceRecord = {
      date: new Date(event.start.dateTime), // Replace with the actual event date from Google Calendar
      event: event.summary, // Replace with the actual event name from Google Calendar

      id: id,
      no: no,
      firstname: capitalizeName(firstName),
      lastname: capitalizeName(lastName),
      pastoral_leader: pl,
      invitedBy: invitedBy,
      sdg_class: sdg_class,
      first_timer: first,
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

      // Firestore query to check if a matching attendance record exists
      db.collection('master_data')
        .doc(selectedName.doc_id)
        .collection('attendance')
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
        // setEventDetails('October 7, 2023 at 2:00:00 PM UTC+8');
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
      selectedName.sdg_class,
      'no'
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
    setShowConfirmationModal(true);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    setSelectedName(null);
    setMatchedNames([]);
  };

  const handleLastNameChange = (e) => {
    const inputLastName = e.target.value;
    setLastName(inputLastName);

    setSelectedName(null);

    if (inputLastName.trim() === '') {
      setMatchedNames([]); // Clear the matched names list if the input is empty
      setFirstName('');
    } else {
      const matched = members.filter((record) =>
        record.lastname.toLowerCase().includes(inputLastName.toLowerCase())
      );
      setMatchedNames(
        matched.map((record) => `${record.lastname}, ${record.firstname}`)
      );
      setSelectedName(null);
    }
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
      const fullName = `${record.lastname}, ${record.firstname}`.toLowerCase();
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
    setFirst('');
    setClassification('');
    setSelectedName(null);
    setShowQRCode(false);
    setUniqueCode('');
    setIsConfirmed(false);
  };

  return (
    <div className="flex justify-center items-start h-screen">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="lastName"
              type="text"
              placeholder="Surname"
              value={lastName}
              onChange={handleLastNameChange}
              required
              autoComplete="off"
            />
            {/* Show Matched names */}
            {lastName.trim().length >= 3 && matchedNames.length > 0 && (
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
            </>
          ) : (
            <>
              <div className="mb-4">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="firstName"
                  type="text"
                  placeholder="Name"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="mb-4">
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  autoComplete="off"
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Kids">Kids</option>
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
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-blue-500"
                      name="gender"
                      value="Male"
                      checked={gender === 'Male'}
                      onChange={(e) => setGender(e.target.value)}
                      required
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
                      required
                    />
                    <span className="text-gray-700">Female</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
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
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="dob"
              >
                Is this your first time to attend?{' '}
              </label>
              <div className="flex items-center space-x-4 mb-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio text-blue-500"
                    name="first"
                    value="no"
                    checked={first === 'no'}
                    onChange={(e) => setFirst(e.target.value)}
                    required
                  />
                  <span className="text-gray-700">No</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio text-pink-500"
                    name="first"
                    value="yes"
                    checked={first === 'yes'}
                    onChange={(e) => setFirst(e.target.value)}
                    required
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
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
        {/* Render the confirmation modal when showConfirmationModal is true */}
        {showConfirmationModal && (
          <FormConfirmationModal
            data={{
              firstname: firstName,
              lastname: lastName,
              birthdate: dob,
              civilstatus: status,
              address: address,
              gender: gender,
              invitedBy: invitedBy,
              contact: contact,
              first: first,
              // Add more fields as needed
            }}
            onClose={handleConfirmationModalClose}
            onConfirm={handleConfirmationModalConfirm}
          />
        )}
        {/* Render the modal when isSubmitted is true or isPresentButtonClicked is true */}
        {(isConfirmed || isPresentButtonClicked) && (
          <Modal
            onClose={() => {
              setIsPresentButtonClicked(false); // Reset isPresentButtonClicked to false when modal is closed
              setIsConfirmed(false);
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
