import React, { useEffect, useState } from "react";
import { db } from "../../utils/firebase"; // Ensure db is correctly initialized
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore"; // v9 modular imports

import { useAuth } from "@/context/AuthContext";

const MembersNotYetRegistered = ({ userEmail }) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    bloodtype: "",
    city: "",
    contact: "",
    birthdate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setNotRegistered } = useAuth();

  // After registration success, update sdgNotYetRegistered and load members
  const handleRegistrationSuccess = () => {
    const fetchMembers = async () => {
      try {
        const membersSnapshot = await getDocs(collection(db, "master_data"));
        const membersData = membersSnapshot.docs.map((doc) => doc.data());
        // After fetching members, set `sdgNotYetRegistered` to false
        setNotRegistered(false);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
  };

  // Fetch user data from master_data collection when the component loads
  useEffect(() => {
    const fetchUserData = async () => {
      const q = query(
        collection(db, "master_data"),
        where("emailadd", "==", userEmail)
      );
      const userSnapshot = await getDocs(q);

      if (!userSnapshot.empty) {
        const userInMasterData = userSnapshot.docs[0].data();
        setUserData(userInMasterData);
        // setFormData(userInMasterData);

        setFormData({
          firstname: userInMasterData.firstname || "",
          middlename: userInMasterData.middlename || "",
          lastname: userInMasterData.lastname || "",
          bloodtype: userInMasterData.bloodtype || "",
          city: userInMasterData.city || "",
          contact: userInMasterData.contact || "",
          birthdate:
            userInMasterData.birthdate && userInMasterData.birthdate.toDate
              ? userInMasterData.birthdate.toDate().toISOString().split("T")[0]
              : userInMasterData.birthdate || "",
        }); // Pre-fill the form with the existing data
      }
    };

    fetchUserData();
  }, [userEmail]);

  // Handle changes to form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (update the data in master_data collection and create/update user in users collection)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update the user's data in the master_data collection
      const q = query(
        collection(db, "master_data"),
        where("emailadd", "==", userEmail)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        await updateDoc(userDocRef, {
          ...formData,
          birthdate: formData.birthdate
            ? Timestamp.fromDate(new Date(formData.birthdate))
            : null,
        });

        setNotRegistered(false);
        handleRegistrationSuccess();
      } else {
        console.error("User not found in master_data");
      }
      //   querySnapshot.forEach(async (doc) => {
      //     await updateDoc(doc.ref, formData); // Update the existing document in master_data
      //   });

      //   // Also create or update the user in the users collection
      const userDocRef = doc(db, "users", userEmail);
      await setDoc(userDocRef, formData, { merge: true });

      //   handleRegistrationSuccess(); // After successful registration, update state
    } catch (error) {
      console.error("Error updating user data: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If we are in the process of submitting, show a loading message
  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-blue-600">Updating, please wait...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* // <div className="mx-auto max-w-7xl px-6 items-center justify-center text-center lg:px-8"> */}
      <h2 className="text-2xl font-semibold mb-4">Confirm Your Registration</h2>
      <p className="text-lg mb-6">
        Please review and confirm your information before completing your
        registration.
      </p>

      {/* Form to display and edit the data */}
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Middle Name
          </label>
          <input
            type="text"
            name="middlename"
            value={formData.middlename}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Blood Type
          </label>
          <input
            type="text"
            name="bloodtype"
            value={formData.bloodtype}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contact Number
          </label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Birthdate
          </label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default MembersNotYetRegistered;
