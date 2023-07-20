// new-attendee.js
import { useState } from "react";
import axios from "axios";

const NewAttendeePage = () => {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [invitedBy, setInvitedBy] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a new attendee using the API
      await axios.post("/api", {
        name,
        birthday,
        address,
        invitedBy,
      });

      setName("");
      setBirthday("");
      setAddress("");
      setInvitedBy("");
    } catch (error) {
      console.error("Error creating new attendee:", error);
    }
  };

  return (
    <div className="h-full w-full container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">New Attendee Registration</h1>
      <form className="max-w-md mx-auto bg-white shadow-md rounded px-8 py-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="birthday"
            className="block text-gray-700 font-bold mb-2"
          >
            Birthday
          </label>
          <input
            id="birthday"
            type="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-gray-700 font-bold mb-2"
          >
            Address
          </label>
          <textarea
            id="address"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your address"
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="invitedBy"
            className="block text-gray-700 font-bold mb-2"
          >
            Invited By
          </label>
          <input
            id="invitedBy"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter the name of the person who invited you"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default NewAttendeePage;
