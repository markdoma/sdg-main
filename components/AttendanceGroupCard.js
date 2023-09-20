import React from 'react';
import { calculateAge } from '@/utils/utilties';
const AttendanceGroupCard = ({ groups, eventOptions }) => {
  // Filter out the Guest group and other classifications
  const otherGroups = groups.filter(
    (group) => group.classification !== 'Guest'
  );

  // Calculate total attendees for all classifications
  const totalAttendees = groups.reduce(
    (acc, group) => acc + group.data.length,
    0
  );

  // Calculate total kids (age < 18) and total adults (age >= 18)
  const totalKids = groups.reduce((acc, group) => {
    return (
      acc +
      group.data.filter((item) => {
        const age = calculateAge(item.birthdate);
        // console.log(age);
        return age < 12;
      }).length
    );
  }, 0);

  // Calculate counts for each classification
  const countByClassification = groups.reduce((acc, group) => {
    const { classification, data } = group;
    acc[classification] = data.length;
    return acc;
  }, {});

  const totalAdults = totalAttendees - totalKids;

  const separateGuestsByCivilStatusAndGender = (guests) => {
    const groupedGuests = {};

    guests.forEach((guest) => {
      const { civilstatus, gender } = guest;
      const groupKey = `${gender} -  ${civilstatus}`;

      if (!groupedGuests[groupKey]) {
        groupedGuests[groupKey] = [];
      }

      groupedGuests[groupKey].push(guest);
    });

    return groupedGuests;
  };

  // Find the Guest group
  const guestGroup = groups.find((group) => group.classification === 'Guest');

  return (
    <div className="flex justify-center items-start h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Attendance Report */}
        <div className="col-span-4 flex justify-center items-center mt-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="col-span-2 md:col-span-3 flex flex-col items-center">
              <div className="w-48 h-16 md:w-48 md:h-24 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                {totalAttendees}
              </div>
              <p className="mt-2 font-bold text-sm">Total Attendees</p>
            </div>
            {/* Display counts for each classification */}
            {Object.entries(countByClassification).map(
              ([classification, count]) => (
                <div
                  className="col-span-1 flex flex-col items-center"
                  key={classification}
                >
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {count}
                  </div>
                  <p className="mt-2 font-bold text-sm">{classification}</p>
                </div>
              )
            )}
            <div className="col-span-1 flex flex-col items-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {totalAdults}
              </div>
              <p className="mt-2 font-bold text-sm">Total Adults</p>
            </div>
            <div className="col-span-1 flex flex-col items-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {totalKids}
              </div>
              <p className="mt-2 font-bold text-sm">Total Kids</p>
            </div>
          </div>
        </div>

        {/* Guest Card */}
        {guestGroup && guestGroup.data && guestGroup.data.length > 0 && (
          <div
            key={guestGroup.classification}
            className="col-span-4 p-4 bg-red-200 rounded"
          >
            <h2 className="text-xl font-bold mb-2">
              {guestGroup.classification}
            </h2>
            {/* Separate guests by civil status and gender */}
            {Object.entries(
              separateGuestsByCivilStatusAndGender(guestGroup.data)
            ).map(([groupKey, guests]) => (
              <div key={groupKey}>
                <h2 className="text-xl font-bold mb-2 mt-4 underline text-center">
                  {groupKey}
                </h2>
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Invited By</th>
                      <th className="px-4 py-2">First Timer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests.map((item) => (
                      <tr
                        key={item.id}
                        className={
                          item.first_timer === 'yes' ? 'bg-green-100' : ''
                        }
                      >
                        <td className="border px-4 py-2">{`${item.firstname} ${item.lastname}`}</td>
                        <td className="border px-4 py-2">{item.invitedBy}</td>
                        <td className="border px-4 py-2 text-center">
                          {item.first_timer === 'yes' ? '🎊 🎉🎊 🎉🎊 🎉' : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* Other Classifications */}
        {otherGroups.length > 0 && (
          <div className="col-span-4 bg-gray-500 p-4 rounded grid grid-cols-1 md:grid-cols-4 gap-4">
            {otherGroups.map(({ classification, data }) => {
              if (data.length === 0) {
                // If there is no data for the classification, do not render the card
                return null;
              }

              let backgroundColor = '';
              switch (classification) {
                case 'Family':
                  backgroundColor = 'bg-green-500';
                  break;
                case 'Non-SDG':
                  backgroundColor = 'bg-blue-500';
                  break;
                case 'Member':
                  backgroundColor = 'bg-white';
                  break;
                default:
                  backgroundColor = 'bg-gray-500';
                  break;
              }

              if (classification === 'Member') {
                // Group members by pastoral_leader
                const groupedMembers = data.reduce((acc, item) => {
                  const pastoralLeader =
                    item.pastoral_leader || 'No Pastoral Leader';
                  if (!acc[pastoralLeader]) {
                    acc[pastoralLeader] = [];
                  }
                  acc[pastoralLeader].push(item);
                  return acc;
                }, {});

                return Object.entries(groupedMembers).map(
                  ([pastoralLeader, members]) => (
                    <div
                      key={pastoralLeader}
                      className={`col-span-1 p-4 rounded ${backgroundColor}`}
                    >
                      <h2 className="text-xl font-bold mb-2">
                        {pastoralLeader}
                      </h2>
                      <ul>
                        {members.map((member) => (
                          <li key={member.id} className="mb-2">
                            {`${member.firstname} ${member.lastname}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                );
              }

              // Render other classifications as a single card
              return (
                <div
                  key={classification}
                  className={`col-span-1 p-4 rounded ${backgroundColor}`}
                >
                  <h2 className="text-xl font-bold mb-2">{classification}</h2>
                  <ul>
                    {data.map((item) => (
                      <li key={item.id} className="mb-2">
                        {`${item.firstname} ${item.lastname}`}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceGroupCard;
