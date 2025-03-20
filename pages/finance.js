import React, { useState } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
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
    } catch (error) {
      console.error("Error adding finance record: ", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addFinanceRecord(fundType, monthYear, amount, proof);
  };

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
      </div>
    </div>
  );
};

export default FinancePage;
