import { useEffect, useState, useContext } from 'react';
import { db } from '../utils/firebase';
import { calculateAge } from '@/utils/utilties';
import AttendeeCard_DND from './AttendeeCard_DND';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import EventContext from '@/context/eventContext';

const AttendanceGrouping = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [processedData, setProcessedData] = useState([]);

  const [divisor, setDivisor] = useState(1);
  const [groupedAttendees, setGroupedAttendees] = useState([]);

  const [masterData, setMasterData] = useState({});

  const selectedEvent = useContext(EventContext);

  useEffect(() => {
    // Fetch all attendance data from collectionGroup
    const unsubscribe = db
      .collectionGroup('attendance')
      .onSnapshot((snapshot) => {
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

  useEffect(() => {
    // Fetch data from master_data collection only once
    const fetchMasterData = async () => {
      const masterDataSnapshot = await db.collection('master_data').get();
      const masterDataList = masterDataSnapshot.docs.map((doc) => doc.data());
      // Convert masterDataList to an object with the document ID as keys for efficient lookup
      const masterDataObject = masterDataList.reduce((acc, data) => {
        // Ensure each document in master_data has a 'doc_id' field
        if (data.doc_id) {
          acc[data.doc_id] = data;
        }
        return acc;
      }, {});
      setMasterData(masterDataObject);
    };

    fetchMasterData();
  }, []);

  useEffect(() => {
    // Filter attendanceData based on the selected eventOptions
    const filteredAttendanceData = attendanceData.filter(
      (item) => item.date === selectedEvent[0]
      // (item) => new Date(item.date) === db.Timestamp.fromDate(selectedEvent)
    );

    console.log(selectedEvent[0]);
    // console.log(filteredAttendanceData);

    // Map the fetched master_data to the filtered attendanceData
    const processedAttendanceData = filteredAttendanceData.map(
      (attendanceItem) => {
        const masterDataItem = masterData[attendanceItem.id] || {};
        return {
          ...attendanceItem,
          birthdate: masterDataItem.birthdate || null,
          gender: masterDataItem.gender || null,
          civilstatus: masterDataItem.civilstatus || null,
          // age: calculateAge(masterDataItem.birthdate),
          // Add other fields from masterDataItem if needed
        };
      }
    );

    // console.log(processedAttendanceData);
    // Call a function to update the state
    setProcessedData(processedAttendanceData);
    console.log(processedData);

    // Render the AttendanceGroupCard or other components using 'groups' data
  }, [attendanceData, selectedEvent, masterData]);

  useEffect(() => {
    // Set the initial divisor value to 3
    setDivisor(3);

    // Automatically group attendees when the component mounts
    groupAttendees();

    // Cleanup function
    return () => {
      // Any cleanup you might need
    };
  }, []);

  // Function to update the groupedAttendees state
  // const updateGroupedAttendees = (processedData) => {
  //   setGroupedAttendees(processedData);
  // };

  const handleDivisorChange = (event) => {
    setDivisor(parseInt(event.target.value));
  };

  const groupAttendees = () => {
    if (!processedData.length) {
      // No data to group, return an array with a placeholder item
      setGroupedAttendees([{ noData: true }]);
      return;
    }

    // Group attendees based on gender
    const groupedData = {};

    processedData.forEach((attendee) => {
      const age = calculateAge(attendee.birthdate); // You need to implement this function
      const gender = attendee.gender;

      if (!groupedData[gender]) {
        groupedData[gender] = [];
      }

      groupedData[gender].push({ ...attendee, age });
    });

    // Divide each gender group based on the divisor and Male-Female pairs
    const processedGroupedAttendees = [];

    const maxGroupSize = parseInt(divisor);
    for (const gender in groupedData) {
      const genderGroup = groupedData[gender];
      const genderSubgroups = [];

      for (let i = 0; i < genderGroup.length; i += maxGroupSize) {
        const subgroup = genderGroup.slice(i, i + maxGroupSize);
        genderSubgroups.push(subgroup);
      }

      // Create Male-Female pairs based on subgroups
      for (let i = 0; i < genderSubgroups.length; i++) {
        if (i >= processedGroupedAttendees.length) {
          processedGroupedAttendees.push({});
        }

        processedGroupedAttendees[i][gender] = genderSubgroups[i];
        // Assign droppableId, groupIndex, and index to each attendee
        genderSubgroups[i].forEach((attendee, attendeeIndex) => {
          attendee.droppableId = `${gender}-${i}-${attendeeIndex}`;
          attendee.groupIndex = i;
          attendee.index = attendeeIndex;
        });
      }
    }

    // Update the state with the grouped attendees
    setGroupedAttendees(processedGroupedAttendees);

    console.log(groupedAttendees);
  };

  const handleAttendeeDragEnd = (result, groupIndex) => {
    // console.log(result);
    if (!result.destination) return;

    const attendeeToMove = groupedAttendees[result.source.droppableId];
    const updatedSourceGroup = [...groupedAttendees];
    updatedSourceGroup.splice(result.source.index, 1);

    const updatedDestGroup = [...groupedAttendees];
    updatedDestGroup.splice(result.destination.index, 0, attendeeToMove);

    const updatedGroupedAttendees = [...groupedAttendees];
    updatedGroupedAttendees[result.source.droppableId] = updatedSourceGroup;
    updatedGroupedAttendees[result.destination.droppableId] = updatedDestGroup;

    setGroupedAttendees(updatedGroupedAttendees);

    console.log(result);
  };

  return (
    <DragDropContext onDragEnd={handleAttendeeDragEnd}>
      <div>
        <div className="flex items-center space-x-4 mb-4">
          {/* <label htmlFor="divisor" className="text-gray-700">
          No. of persons per group:
        </label> */}
          <input
            type="number"
            id="divisor"
            name="divisor"
            value={divisor}
            onChange={handleDivisorChange}
            className="px-3 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
          />
          <button
            onClick={groupAttendees}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Group Attendees
          </button>
        </div>

        {/* Render the grouped attendees */}
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          {groupedAttendees.map((group, index) => (
            <div key={index} className="mb-8 w-full">
              {' '}
              {/* Remove md:w-1/2 class */}
              {group.noData ? (
                <p>No attendance data to group</p>
              ) : (
                <>
                  <h3 className="font-bold text-2xl flex justify-center items-center mb-4 bg-blue-500 text-white rounded-md py-2">
                    Group {index + 1}
                  </h3>
                  {group.Male && (
                    <div className="mb-4">
                      <h3 className="font-bold text-xl flex justify-center items-center mb-2 bg-green-500 text-white rounded-md py-2">
                        Male
                      </h3>
                      {group.Male &&
                      Array.isArray(group.Male) &&
                      group.Male.length > 0 ? (
                        <Droppable
                          droppableId={group.droppableId}
                          key={group.droppableId}
                        >
                          {(provided) => (
                            <ul
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {group.Male.map((attendee, attendeeIndex) => (
                                <AttendeeCard_DND
                                  key={attendee.firstname}
                                  person={attendee}
                                  groupIndex={group.groupIndex}
                                  droppableId={group.droppableId}
                                  attendeeIndex={attendeeIndex}
                                  handleDragEnd={handleAttendeeDragEnd}
                                />
                              ))}
                              {provided.placeholder}
                            </ul>
                          )}
                        </Droppable>
                      ) : (
                        <p>No Male attendees in this group</p>
                      )}
                    </div>
                  )}
                  {group.Female && (
                    <div className="mb-4">
                      <h3 className="font-bold text-xl flex justify-center items-center mb-2 bg-pink-500 text-white rounded-md py-2">
                        Female
                      </h3>
                      {group.Female &&
                      Array.isArray(group.Female) &&
                      group.Female.length > 0 ? (
                        <Droppable
                          droppableId={group.droppableId}
                          key={group.droppableId}
                        >
                          {(provided) => (
                            <ul
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {group.Female.map((attendee, attendeeIndex) => (
                                <AttendeeCard_DND
                                  key={attendee.firstname}
                                  person={attendee}
                                  groupIndex={group.groupIndex}
                                  droppableId={group.droppableId}
                                  attendeeIndex={attendeeIndex}
                                  handleDragEnd={handleAttendeeDragEnd}
                                />
                              ))}
                              {provided.placeholder}
                            </ul>
                          )}
                        </Droppable>
                      ) : (
                        <p>No Female attendees in this group</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default AttendanceGrouping;
