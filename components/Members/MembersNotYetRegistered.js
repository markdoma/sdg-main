import React, { useEffect, useState } from "react";
import { db } from "../../utils/firebase"; // Ensure db is correctly initialized

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

  // Fetch user data from master_data collection when the component loads
  useEffect(() => {
    const fetchUserData = async () => {
      const userSnapshot = await db
        .collection("master_data")
        .where("emailadd", "==", userEmail)
        .get();

      if (!userSnapshot.empty) {
        const userInMasterData = userSnapshot.docs[0].data();
        setUserData(userInMasterData);
        setFormData(userInMasterData); // Pre-fill the form with the existing data
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
      await db
        .collection("master_data")
        .where("emailadd", "==", userEmail)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            await doc.ref.update(formData); // Update the existing document in master_data
          });
        });

      // Also create or update the user in the users collection
      await db
        .collection("users")
        .doc(userEmail)
        .set(formData, { merge: true });

      // Optionally, display a success message or redirect
      alert("Registration data updated successfully!");

      // You could redirect the user or show another message after successful registration
    } catch (error) {
      console.error("Error updating user data: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If we are in the process of submitting, show a loading message
  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg text-blue-600">Updating, please wait...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
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
