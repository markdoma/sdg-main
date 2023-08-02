// components/AttendanceSummaryReport.js

import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';

const AttendanceSummaryReport = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  // Fetch data using useEffect
  useEffect(() => {
    const unsubscribe = db.collection('attendance').onSnapshot((snapshot) => {
      const fetchedAttendance = snapshot.docs.map((doc) => doc.data());
      // Convert Firestore timestamps to JavaScript Date objects
      const processedAttendanceData = fetchedAttendance.map((item) => ({
        ...item,
        date: item.date.toDate().toLocaleDateString('en-US'), // Assuming 'date' is the field with the timestamp
      }));
      setAttendanceData(processedAttendanceData);
    });

    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts
      unsubscribe();
    };
  }, []);

  // Function to group records by pastoral_leader
  const groupByPastoralLeader = (data) => {
    return data.reduce((result, item) => {
      const leader = item.pastoral_leader;
      const eventName = item.event; // Assuming 'event' field contains the event name
      if (!result[leader]) {
        result[leader] = {
          pastoralLeader: leader,
          eventName,
          dates: new Set(),
          details: [],
        };
      }
      result[leader].dates.add(item.date);
      result[leader].details.push({
        date: item.date,
        firstname: item.firstname,
        lastname: item.lastname,
        invitedBy: item.invitedBy, // Include the 'invitedby' column for the Guest Card
      });
      return result;
    }, {});
  };

  const groupedData = groupByPastoralLeader(attendanceData);

  // Sort the groupedData array so that 'Guest' comes first
  const sortedGroupedData = Object.values(groupedData).sort((a, b) =>
    a.pastoralLeader === 'Guest' ? -1 : b.pastoralLeader === 'Guest' ? 1 : 0
  );

  return (
    <div className="flex justify-center items-start h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedGroupedData.map(
          ({ pastoralLeader, eventName, dates, details }, index) => (
            <div
              key={pastoralLeader}
              className={`flex items-stretch mb-4 ${
                pastoralLeader === 'Guest' ? 'bg-red-100' : ''
              }`}
            >
              <div className="border p-4 rounded-lg shadow-md w-full">
                <h4 className="font-semibold mb-2 text-center">{`${pastoralLeader}`}</h4>
                <div className="flex justify-center">
                  <table className="table-auto w-full border-collapse border">
                    <thead>
                      <tr>
                        <th className="font-semibold border px-4 py-2">
                          First Name
                        </th>
                        <th className="font-semibold border px-4 py-2">
                          Last Name
                        </th>
                        {pastoralLeader === 'Guest' && (
                          <th className="font-semibold border px-4 py-2">
                            Invited By
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {details.map((record, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                          }`}
                        >
                          <td className="border px-4 py-2">
                            <div className="flex justify-center">
                              {record.firstname}
                            </div>
                          </td>
                          <td className="border px-4 py-2">
                            <div className="flex justify-center">
                              {record.lastname}
                            </div>
                          </td>
                          {pastoralLeader === 'Guest' && (
                            <td className="border px-4 py-2">
                              <div className="flex justify-center">
                                {record.invitedBy}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AttendanceSummaryReport;
