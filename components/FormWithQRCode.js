import { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { v4 as uuidv4 } from "uuid";
import { db } from "../utils/firebase";

import Modal from "../components/Modal";

const FormWithQRCode = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDOB] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [invitedBy, setInvitedBy] = useState("");
  const [status, setStatus] = useState("");
  const [classification, setClassification] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [uniqueCode, setUniqueCode] = useState("");

  const [dummyData, setDummyData] = useState([]);
  const [members, setMembers] = useState([]);
  const [matchedNames, setMatchedNames] = useState([]);
  const [matchedInviter, setMatchedInviter] = useState([]);
  const [selectedName, setSelectedName] = useState(null);

  useEffect(() => {
    const unsubscribe = db.collection("master").onSnapshot((snapshot) => {
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

  // useEffect(() => {
  //   // Fetch dummy data (replace with your own data source)
  //   const fetchedData = fetchDummyData();
  //   setDummyData(fetchedData);
  // }, []);

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // if (selectedName) {
    //   const generatedCode = selectedName.qrCode;
    //   setUniqueCode(generatedCode);
    // } else {
    //   const generatedCode = uuidv4();
    //   setUniqueCode(generatedCode);
    // }

    const generatedCode = uuidv4();
    setUniqueCode(generatedCode);
    setShowQRCode(true);
    setIsSaved(true);

    // Prepare the data to be saved in the database
    const newData = {
      no: getMaxNoValue() + 1,
      parent_no: null,
      lastname: lastName,
      firstname: firstName,
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
      class: classification,
      status: null,
      pl: null,
      service_role: null,
      ligaya: null,
      chrurch: null,
      lat: null,
      long: null,
      qrCode: uniqueCode,
      insert_date: new Date(),
      insert_by: "Reg Team",
      update_date: null,
      update_by: null,
    };

    // Add the data to the "master" collection in the database
    db.collection("master")
      .add(newData)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        // If you need to do anything after successfully adding the record, you can put it here.
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const handleModalClose = () => {
    // Handle form reset and modal close
    setIsSaved(false);
    resetForm();
  };

  // const fetchDummyData = () => {
  //   // Replace this with your own data source or API call
  //   const data = [
  //     {
  //       firstName: "Biboy",
  //       lastName: "Doma",
  //       gender: "Male",
  //       contact: "09277781103",
  //       dob: "1990-01-01",
  //       address: "123 Main St",
  //       invitedBy: "Jane Smith",
  //       qrCode: "dummy-qr-code-1",
  //     },
  //     {
  //       firstName: "Elle",
  //       lastName: "Doma",
  //       gender: "Female",
  //       contact: "09277781103",
  //       dob: "1985-05-12",
  //       address: "456 Elm St",
  //       invitedBy: "John Doe",
  //       qrCode: "dummy-qr-code-2",
  //     },
  //     {
  //       firstName: "Elle",
  //       lastName: "Reyes",
  //       gender: "Female",
  //       contact: "09277781103",
  //       dob: "1985-05-12",
  //       address: "456 Elm St",
  //       invitedBy: "John Doe",
  //       qrCode: "dummy-qr-code-2",
  //     },
  //     // Add more dummy records here
  //   ];
  //   return data;
  // };

  const handleFirstNameChange = (e) => {
    const inputFirstName = e.target.value;
    setFirstName(inputFirstName);

    setSelectedName(null);

    if (inputFirstName.trim() === "") {
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

    if (inputInvitedBy.trim() === "") {
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
    console.log(selectedName);
    const matchedRecord = members.find((record) => {
      const fullName = `${record.firstname} ${record.lastname}`.toLowerCase();
      return fullName === selectedName.toLowerCase();
    });

    console.log(matchedRecord);

    if (matchedRecord) {
      setFirstName(matchedRecord.firstname);
      setLastName(matchedRecord.lastname);
      setMatchedNames([]);
      setSelectedName(matchedRecord);
      setShowQRCode(true);
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setDOB("");
    setGender("");
    setContact("");
    setAddress("");
    setInvitedBy("");
    setStatus("");
    setClassification("");
    setSelectedName(null);
    setShowQRCode(false);
    setUniqueCode("");
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
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="firstName"
            >
              First Name
            </label>
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
            {matchedNames.length > 0 && firstName.trim() !== "" && (
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
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold">{`${selectedName.firstname} ${selectedName.lastname}`}</p>
              </div>

              <div className="flex justify-center items-center">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  // onClick={() => setIsButtonCentered(true)}
                >
                  Present
                </button>
              </div>

              {/* <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="qrCode"
                >
                  Assigned QR Code
                </label>
                <QRCode value={selectedName.qrCode} size={256} />
              </div> */}
            </>
          ) : (
            <>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
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
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="status"
                >
                  Status
                </label>
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
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="gender"
                >
                  Gender
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-blue-500"
                      name="gender"
                      value="Male"
                      checked={gender === "Male"}
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
                      checked={gender === "Female"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <span className="text-gray-700">Female</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="contact"
                >
                  Contact
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="contact"
                  type="text"
                  placeholder="Contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="address"
                >
                  Address
                </label>
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
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="invitedBy"
                >
                  Invited By
                </label>
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
                {matchedInviter.length > 0 && invitedBy.trim() !== "" && (
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
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="classification"
                  >
                    Classification
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="classification"
                    value={classification}
                    onChange={(e) => setClassification(e.target.value)}
                    required
                  >
                    <option value="">Select Classification</option>
                    <option value="LNP Member SDG">LNP Member SDG</option>
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
        {isSaved && <Modal onClose={handleModalClose} />}
        {/* Render the modal when isSaved is true */}
        {/* {showQRCode && !selectedName && (
          <>
            <div className="flex justify-center items-center">
              <QRCode value={uniqueCode} size={256} />
            </div>
          </>
        )} */}
      </div>
    </div>
  );
};

export default FormWithQRCode;
