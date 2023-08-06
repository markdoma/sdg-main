import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const AttendanceGrouping = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [divisor, setDivisor] = useState(1);
  const [groupedAttendees, setGroupedAttendees] = useState([]);

  useEffect(() => {
    // Fetch attendance data from Firestore (replace 'YOUR_COLLECTION_PATH' with the actual path)
    const fetchData = async () => {
      const snapshot = await firebase
        .firestore()
        .collection('YOUR_COLLECTION_PATH')
        .get();
      const data = snapshot.docs.map((doc) => doc.data());
      setAttendanceData(data);
    };

    fetchData();
  }, []);

  const handleDivisorChange = (event) => {
    setDivisor(parseInt(event.target.value));
  };

  // Function to group attendees based on age and gender
  const groupAttendees = () => {
    if (!attendanceData.length) {
      // No data to group, return empty array
      return [];
    }

    // ... (same grouping logic as before)

    // Update the state with the grouped attendees
    setGroupedAttendees(groups);
  };

  return (
    <div>
      <label htmlFor="divisor">No. of person per group:</label>
      <input
        type="number"
        id="divisor"
        name="divisor"
        value={divisor}
        onChange={handleDivisorChange}
      />
      <button onClick={groupAttendees}>Group Attendees</button>

      {/* Render the grouped attendees */}
      {groupedAttendees.map((group, index) => (
        <div key={index}>
          <h3>Group {index + 1}</h3>
          <div>
            <h4>Male Attendees</h4>
            <ul>
              {group.male.map((attendee) => (
                <li key={attendee.name}>{attendee.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Female Attendees</h4>
            <ul>
              {group.female.map((attendee) => (
                <li key={attendee.name}>{attendee.name}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttendanceGrouping;
