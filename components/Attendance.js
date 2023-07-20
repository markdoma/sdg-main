import { useState } from "react";
import WithPastoralLeader from "../components/WithPastoralLeader";
import ExistingAttendeePage from "../pages/existing-attendee";
import NewAttendeePage from "../pages/new-attendee";
import GuestAttendeePage from "../pages/guest-attendee";

const AttendancePage = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [isNewAttendee, setIsNewAttendee] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [hasPastoralLeader, setHasPastoralLeader] = useState(false);

  const handleExistingAttendee = () => {
    setIsNewAttendee(false);
    setModalVisible(false);
  };

  const handleNewAttendee = () => {
    setIsNewAttendee(true);
    setModalVisible(false);
  };

  const handleGuestAttendee = () => {
    setIsGuest(true);
    setModalVisible(false);
  };

  const handlePastoralLeader = (hasLeader) => {
    setHasPastoralLeader(hasLeader);
    setModalVisible(false);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      {modalVisible && (
        <div className="h-full w-full bg-white p-20 rounded-md shadow-md grid grid-cols-2 gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded col-span-1"
            onClick={() => handlePastoralLeader(true)}
          >
            Yes, I have a pastoral leader
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded col-span-1"
            onClick={() => handlePastoralLeader(false)}
          >
            No, I don't have a pastoral leader
          </button>
        </div>
      )}

      {!modalVisible && hasPastoralLeader && <WithPastoralLeader />}
      {!modalVisible && !hasPastoralLeader && (
        <>
          {isGuest && <GuestAttendeePage />}
          {!isGuest && <NewAttendeePage />}
        </>
      )}
    </div>
  );
};

export default AttendancePage;
