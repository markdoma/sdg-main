import { useState } from "react";

const ExistingAttendeePage = () => {
  const [selectedMWG, setSelectedMWG] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [attendees, setAttendees] = useState([
    { id: 1, name: "Attendee 1", mwg: "Suzara", present: true },
    { id: 2, name: "Attendee 2", mwg: "Suzara", present: false },
    { id: 3, name: "Attendee 3", mwg: "Doma", present: true },
    { id: 4, name: "Attendee 4", mwg: "Doma", present: false },
    { id: 5, name: "Attendee 5", mwg: "Magallanes", present: true },
    { id: 6, name: "Attendee 6", mwg: "Magallanes", present: false },
    { id: 7, name: "Attendee 7", mwg: "Unite", present: true },
    { id: 8, name: "Attendee 8", mwg: "Unite", present: false },
    { id: 9, name: "Attendee 9", mwg: "Saquilayan", present: true },
    { id: 10, name: "Attendee 10", mwg: "Saquilayan", present: false },
  ]);

  // Dummy list of events
  const events = [
    { date: "2023-06-28", name: "Event 1" },
    { date: "2023-06-27", name: "Event 2" },
    { date: "2023-06-30", name: "Event 3" },
    // Add more dummy events...
  ];

  const handleMWGSelection = (mwg) => {
    setSelectedMWG(mwg);
    setSelectedEvent("");
  };

  const handleEventSelection = (event) => {
    setSelectedEvent(event);
  };

  const handleAttendanceToggle = (attendeeId) => {
    setAttendees((prevAttendees) =>
      prevAttendees.map((attendee) =>
        attendee.id === attendeeId
          ? {
              ...attendee,
              present: !attendee.present,
              eventName: selectedEvent,
            }
          : attendee
      )
    );
  };

  const filteredAttendees = selectedMWG
    ? attendees.filter((attendee) => attendee.mwg === selectedMWG)
    : [];

  const currentDate = new Date().toISOString().split("T")[0];
  const eventsForCurrentDate = events.filter(
    (event) => event.date === currentDate
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4">MWGs</h2>
            <ul className="space-y-2">
              <li
                className={`cursor-pointer ${
                  selectedMWG === "Suzara" ? "font-bold" : ""
                }`}
                onClick={() => handleMWGSelection("Suzara")}
              >
                Suzara
              </li>
              <li
                className={`cursor-pointer ${
                  selectedMWG === "Doma" ? "font-bold" : ""
                }`}
                onClick={() => handleMWGSelection("Doma")}
              >
                Doma
              </li>
              <li
                className={`cursor-pointer ${
                  selectedMWG === "Magallanes" ? "font-bold" : ""
                }`}
                onClick={() => handleMWGSelection("Magallanes")}
              >
                Magallanes
              </li>
              <li
                className={`cursor-pointer ${
                  selectedMWG === "Unite" ? "font-bold" : ""
                }`}
                onClick={() => handleMWGSelection("Unite")}
              >
                Unite
              </li>
              <li
                className={`cursor-pointer ${
                  selectedMWG === "Saquilayan" ? "font-bold" : ""
                }`}
                onClick={() => handleMWGSelection("Saquilayan")}
              >
                Saquilayan
              </li>
            </ul>
          </div>
        </div>

        <div className="col-span-3">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4">Members</h2>
            {selectedMWG ? (
              <ul className="space-y-2">
                {filteredAttendees.map((attendee) => (
                  <li
                    key={attendee.id}
                    className="flex items-center justify-between"
                  >
                    <span>{attendee.name}</span>
                    {selectedEvent || eventsForCurrentDate.length === 1 ? (
                      <button
                        className={`text-sm px-2 py-1 rounded ${
                          attendee.present
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                        onClick={() => handleAttendanceToggle(attendee.id)}
                      >
                        {attendee.present ? "Present" : "Absent"}
                      </button>
                    ) : (
                      <p className="text-gray-500">Select an event</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Select an MWG to view its members</p>
            )}
          </div>
        </div>
        {eventsForCurrentDate.length > 1 && (
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-bold mb-4">Events</h2>
              <select
                className="px-2 py-1 rounded"
                value={selectedEvent}
                onChange={(e) => handleEventSelection(e.target.value)}
              >
                <option value="">Select an event</option>
                {eventsForCurrentDate.map((event) => (
                  <option key={event.name} value={event.name}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExistingAttendeePage;
