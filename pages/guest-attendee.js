import { useState } from "react";

const GuestAttendeePage = () => {
  const [selectedMWG, setSelectedMWG] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [attendees, setAttendees] = useState([
    { id: 11, name: "Attendee 11", mwg: "Guest", present: false },
    { id: 12, name: "Attendee 12", mwg: "Guest", present: true },
    { id: 13, name: "Attendee 13", mwg: "Guest", present: false },
    { id: 14, name: "Attendee 14", mwg: "New", present: true },
    { id: 15, name: "Attendee 15", mwg: "New", present: false },
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
            <h2 className="text-xl font-bold mb-4">Guest</h2>
            <ul className="space-y-2">
              <li
                className={`cursor-pointer ${
                  selectedMWG === "New" ? "font-bold" : ""
                }`}
                onClick={() => handleMWGSelection("New")}
              >
                New
              </li>
              <li
                className={`cursor-pointer ${
                  selectedMWG === "Guest" ? "font-bold" : ""
                }`}
                onClick={() => handleMWGSelection("Guest")}
              >
                Guest
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

export default GuestAttendeePage;
