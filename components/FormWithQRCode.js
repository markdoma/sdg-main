import { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { v4 as uuidv4 } from "uuid";

const FormWithQRCode = () => {
  const [name, setName] = useState("");
  const [dob, setDOB] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [invitedBy, setInvitedBy] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [uniqueCode, setUniqueCode] = useState("");

  const [dummyData, setDummyData] = useState([]);
  const [matchedNames, setMatchedNames] = useState([]);
  const [selectedName, setSelectedName] = useState(null);

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };
  useEffect(() => {
    // Fetch dummy data (replace with your own data source)
    const fetchedData = fetchDummyData();
    setDummyData(fetchedData);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedName) {
      const generatedCode = selectedName.qrCode;
      setUniqueCode(generatedCode);
      setShowQRCode(true);
    } else {
      const generatedCode = uuidv4();
      setUniqueCode(generatedCode);
      setShowQRCode(true);
    }
  };

  const fetchDummyData = () => {
    // Replace this with your own data source or API call
    const data = [
      {
        name: "John Doe",
        gender: "Male",
        contact: "09277781103",
        dob: "1990-01-01",
        address: "123 Main St",
        invitedBy: "Jane Smith",
        qrCode: "dummy-qr-code-1",
      },
      {
        name: "Jane Smith",
        gender: "Female",
        contact: "09277781103",
        dob: "1985-05-12",
        address: "456 Elm St",
        invitedBy: "John Doe",
        qrCode: "dummy-qr-code-2",
      },
      // Add more dummy records here
    ];
    return data;
  };

  const handleNameChange = (e) => {
    const inputName = e.target.value;
    setName(inputName);

    const matched = dummyData.filter((record) =>
      record.name.toLowerCase().includes(inputName.toLowerCase())
    );
    setMatchedNames(matched);
    setSelectedName(null);
  };

  const handleMatchedNameClick = (selectedName) => {
    const matchedRecord = dummyData.find(
      (record) => record.name.toLowerCase() === selectedName.toLowerCase()
    );
    if (matchedRecord) {
      setName("");
      setMatchedNames([]);
      setSelectedName(matchedRecord);
      setShowQRCode(true);
    }
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
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={handleNameChange}
              required
            />
            {matchedNames.length > 0 && (
              <ul className="mt-2 p-2 border border-gray-300 bg-white rounded-md">
                {matchedNames.map((matchedName, index) => (
                  <li
                    key={index}
                    className="cursor-pointer py-1 hover:bg-gray-100"
                    onClick={() => handleMatchedNameClick(matchedName.name)}
                  >
                    {matchedName.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {selectedName ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold">{selectedName.name}</p>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="qrCode"
                >
                  Assigned QR Code
                </label>
                <QRCode value={selectedName.qrCode} size={256} />
              </div>
            </>
          ) : (
            <>
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
                  type="text"
                  placeholder="Date of Birth"
                  value={dob}
                  onChange={(e) => setDOB(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="gender"
                >
                  Gender
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
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
                  onChange={(e) => setInvitedBy(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Generate QR Code
                </button>
              </div>
            </>
          )}
        </form>
        {showQRCode && !selectedName && (
          <div className="flex justify-center items-center">
            <QRCode value={uniqueCode} size={256} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormWithQRCode;
