import React from 'react';

// Function to calculate age based on birthdate
const calculateAge = (birthdate) => {
  const today = new Date();
  // Convert birthdate (in seconds) to milliseconds by multiplying with 1000
  const birthDate = new Date(birthdate.seconds * 1000);
  let age = today.getFullYear() - birthDate.getFullYear();
  console.log(birthdate);
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const AttendanceGroupCard = ({ groups }) => {
  // Find the Guest group
  const guestGroup = groups.find((group) => group.classification === 'Guest');

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
        return age < 18;
      }).length
    );
  }, 0);

  const totalAdults = totalAttendees - totalKids;

  return (
    <div className="flex justify-center items-start h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Attendance Report */}
        <div className="col-span-4 flex justify-center items-center mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-1 flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {totalAttendees}
              </div>
              <p className="mt-2">Total Attendees</p>
            </div>
            <div className="col-span-1 flex flex-col items-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {totalAdults}
              </div>
              <p className="mt-2">Total Adults</p>
            </div>
            <div className="col-span-1 flex flex-col items-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {totalKids}
              </div>
              <p className="mt-2">Total Kids</p>
            </div>
          </div>
        </div>

        {/* Guest Card */}
        {guestGroup && guestGroup.data.length > 0 && (
          <div
            key={guestGroup.classification}
            className="col-span-4 p-4 bg-red-300 rounded"
          >
            <h2 className="text-xl font-bold mb-2">
              {guestGroup.classification}
            </h2>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Invited By</th>
                </tr>
              </thead>
              <tbody>
                {guestGroup.data.map((item) => (
                  <tr key={item.id}>
                    <td className="border px-4 py-2">{`${item.firstname} ${item.lastname}`}</td>
                    <td className="border px-4 py-2">{item.invitedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
