import React from 'react';

const AttendanceGroupCard = ({ groups }) => {
  // Find the Guest group
  const guestGroup = groups.find((group) => group.classification === 'Guest');

  // Filter out the Guest group and other classifications
  const otherGroups = groups.filter(
    (group) => group.classification !== 'Guest'
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {guestGroup && guestGroup.data.length > 0 && (
        <div
          key={guestGroup.classification}
          className="col-span-4 p-4 bg-red-200 rounded"
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

      <div className="col-span-3 grid grid-cols-3 md:grid-cols-4 gap-4">
        {otherGroups.map(({ classification, data }) => {
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
                  className={`col-span-1 p-4 rounded bg-white`}
                >
                  <h2 className="text-xl font-bold mb-2">{pastoralLeader}</h2>
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
              className={`col-span-1 p-4 rounded ${
                classification === 'Family' ? 'bg-green-500' : 'bg-blue-500'
              }`}
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
    </div>
  );
};

export default AttendanceGroupCard;
