import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const FinancePage = () => {
  const [fundType, setFundType] = useState("Tithes");

  const {
    user,
    signInWithGoogle,
    logout,
    error,
    setError,
    notRegistered,
    setNotRegistered,
    navigation,
    initialMembers,
    loading, // Use loading from context
    userDetails, // Add userDetails from context
  } = useAuth();
  const [monthYear, setMonthYear] = useState(() => {
    const now = new Date();
    return `${now.toLocaleString("default", {
      month: "long",
    })} - ${now.getFullYear()}`;
  });
  const [amount, setAmount] = useState("");
  const [proof, setProof] = useState(null);
  const [financeRecords, setFinanceRecords] = useState([]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProof(event.target.files[0]);
    }
  };

  const addFinanceRecord = async (fundType, monthYear, amount, proof) => {
    if (!userDetails || !userDetails.doc_id) {
      console.error("User ID not found. Please log in.");
      return;
    }

    const [month, year] = monthYear.split(" - "); // Extract month and year

    const newFinanceRecord = {
      fundType,
      monthYear,
      month, // Add month field
      year, // Add year field
      id: userDetails.doc_id,
      firstname: userDetails.firstname, // Add firstname field
      lastname: userDetails.lastname, // Add lastname field
      amount: parseFloat(amount),
      proof: proof ? proof.name : null, // Save the file name or handle file upload separately
      date: new Date(),
    };

    try {
      const docRef = await addDoc(
        collection(db, `master_data/${userDetails.doc_id}/finance`),
        newFinanceRecord
      );
      console.log("Finance record added with ID: ", docRef.id);

      // Update the financeRecords state to include the new record
      setFinanceRecords((prevRecords) => [...prevRecords, newFinanceRecord]);
    } catch (error) {
      console.error("Error adding finance record: ", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addFinanceRecord(fundType, monthYear, amount, proof);
  };

  useEffect(() => {
    const fetchFinanceRecords = async () => {
      if (!userDetails || !userDetails.doc_id) {
        console.error("User ID not found. Please log in.");
        return;
      }

      try {
        const querySnapshot = await getDocs(
          collection(db, `master_data/${userDetails.doc_id}/finance`)
        );
        const records = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            date: data.date instanceof Date ? data.date : data.date.toDate(), // Ensure date is a Date object
          };
        });
        setFinanceRecords(records);
      } catch (error) {
        console.error("Error fetching finance records: ", error);
      }
    };

    fetchFinanceRecords();
  }, [userDetails]);

  return (
    <div className="flex justify-center items-start h-screen">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h1 className="text-xl font-bold mb-4">Tithes/Alms Fund</h1>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="fundType"
            >
              Fund Type
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="fundType"
              value={fundType}
              onChange={(e) => setFundType(e.target.value)}
            >
              <option value="Tithes">Tithes</option>
              <option value="Alms Fund">Alms Fund</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="monthYear"
            >
              Month - Year
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="monthYear"
              value={monthYear}
              onChange={(e) => setMonthYear(e.target.value)}
            >
              {Array.from({ length: 12 }).map((_, index) => {
                const date = new Date();
                date.setMonth(index);
                const optionValue = `${date.toLocaleString("default", {
                  month: "long",
                })} - ${date.getFullYear()}`;
                return (
                  <option key={index} value={optionValue}>
                    {optionValue}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="amount"
            >
              Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="proof"
            >
              Picture Proof
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="file"
              id="proof"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>

        <div className="bg-white rounded px-8 pt-6 pb-8">
          <h2 className="text-xl font-bold mb-4 text-center">
            Finance Records
          </h2>
          <div className="flex justify-center">
            <table className="table-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">
                    Fund Type
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Month</th>
                  <th className="border border-gray-300 px-4 py-2">Year</th>
                  <th className="border border-gray-300 px-4 py-2">
                    First Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Last Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Amount</th>
                  <th className="border border-gray-300 px-4 py-2">Proof</th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {financeRecords.map((record, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.fundType}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.month}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.year}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.firstname}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.lastname}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.amount}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.proof}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.date.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
