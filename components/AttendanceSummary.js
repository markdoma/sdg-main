// components/AttendanceComponent.js
import { useState, useEffect } from "react";
// import { firestore } from "../utils/firebase"; // Initialize Firestore here
import { db } from "../utils/firebase";

const AttendanceComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [attendanceData, setAttendanceData] = useState([]);
  const [masterData, setMasterData] = useState([]);

  useEffect(() => {
    // Fetch events from Firestore attendance collection
    db.collection("attendance")
      .get()
      .then((snapshot) => {
        const eventsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // console.log(eventsData);
        setEvents(eventsData);

        // Set default event to the latest one
        if (eventsData.length > 0) {
          setSelectedEvent(eventsData[eventsData.length - 1].id);
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  useEffect(() => {
    // console.log(selectedEvent);
    // Fetch attendance data based on selected event
    if (selectedEvent) {
      db.collection("attendance")
        .where("event", "==", selectedEvent)
        .get()
        .then((snapshot) => {
          const attendanceData = snapshot.docs.map((doc) => doc.data());
          setAttendanceData(attendanceData);
        })
        .catch((error) => {
          console.error("Error fetching attendance data:", error);
        });
    }
  }, [selectedEvent]);

  useEffect(() => {
    // Fetch master data from Firestore master collection
    db.collection("master")
      .get()
      .then((snapshot) => {
        const masterData = snapshot.docs.map((doc) => doc.data());
        setMasterData(masterData);
      })
      .catch((error) => {
        console.error("Error fetching master data:", error);
      });
  }, []);

  // Group attendance data by PL from the master collection
  const groupedData = {}; // Structure: { pl1: [{ firstName, lastName, status }, ...], pl2: [{ firstName, lastName, status }, ...], ... }
  attendanceData.forEach((data) => {
    // Find the corresponding firstname and lastname from the master data using the personId
    const person = masterData.find((item) => item.no === data.no);
    if (person) {
      const pl = person.PL;
      if (!groupedData[pl]) {
        groupedData[pl] = [];
      }
      groupedData[pl].push({
        firstName: person.firstName,
        lastName: person.lastName,
        status: data.status,
      });
    }
  });

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
  };

  console.log(selectedEvent);
  return (
    <div>
      <div>
        {/* Dropdown to select events */}
        <select value={selectedEvent} onChange={handleEventChange}>
          {events.map((event) => (
            <option key={event.id}>
              {/* {event.event} */}
              Open Door Pathways
              {/* Assuming 'name' is a field in the attendance collection */}
            </option>
          ))}
        </select>
      </div>
      {Object.entries(groupedData).map(([pl, data]) => (
        <div key={pl}>
          <h2>PL: {pl}</h2>
          {data.map((person, index) => (
            <div key={index}>
              <p>
                Name: {person.firstName} {person.lastName}
              </p>
              <p>Status: {person.status}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AttendanceComponent;
