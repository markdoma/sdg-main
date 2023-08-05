import React from 'react';

const FormConfirmationModal = ({ data, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Confirm Your Information</h2>
        <p className="mb-4">
          Please review the information you provided and confirm if it's
          correct.
        </p>
        <div className="mb-2">
          <p className="font-bold">Surname:</p>
          <p>{data.lastname}</p>
        </div>
        <div className="mb-2">
          <p className="font-bold">Name:</p>
          <p>{data.firstname}</p>
        </div>
        <div className="mb-2">
          <p className="font-bold">Gener:</p>
          <p>{data.gender}</p>
        </div>
        <div className="mb-2">
          <p className="font-bold">Date of Birth:</p>
          <p>{data.birthdate}</p>
        </div>
        <div className="mb-2">
          <p className="font-bold">Address:</p>
          <p>{data.address}</p>
        </div>
        <div className="mb-2">
          <p className="font-bold">Status:</p>
          <p>{data.civilstatus}</p>
        </div>
        <div className="mb-2">
          <p className="font-bold">Invited By:</p>
          <p>{data.invitedBy}</p>
        </div>
        <div className="mb-10">
          <p className="font-bold">
            First time to attend:{' '}
            <span className="text-red-800">{data.first.toUpperCase()}</span>
          </p>
          {/* <p>{data.first}</p> */}
        </div>
        {/* Add more fields as needed */}
        <div className="flex justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={onClose}
          >
            Edit
          </button>
        </div>
        <div className="m-4">
          <p className="italic text-gray-600 text-sm">
            Disclaimer: The information you provide will solely be used for
            Ligaya ng Panginoon purposes. We prioritize data privacy and do not
            share your data with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormConfirmationModal;
