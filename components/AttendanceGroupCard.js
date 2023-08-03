import React from 'react';

const AttendanceGroupCard = ({ groups }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {groups.map(({ classification, data }) => {
        if (data.length === 0) {
          // Do not display the card if there's no data for the classification
          return null;
        }

        let backgroundColor = '';

        switch (classification) {
          case 'Member':
            backgroundColor = 'bg-yellow-500';
            break;
          case 'Family':
            backgroundColor = 'bg-green-500';
            break;
          case 'Guest':
            backgroundColor = 'bg-red-500';
            break;
          case 'Non-SDG':
            backgroundColor = 'bg-blue-500';
            break;
          default:
            backgroundColor = 'bg-gray-500';
            break;
        }

        if (classification === 'Member') {
          // Group members with the same 'pastoral_leader' value into separate cards
          const uniquePastoralLeaders = Array.from(
            new Set(data.map((item) => item.pastoral_leader))
          );

          return uniquePastoralLeaders.map((pastoralLeader) => (
            <div
              key={pastoralLeader}
              className={`p-4 rounded ${backgroundColor} my-4`}
            >
              {/* <h2 className="text-xl font-bold mb-2">{classification}</h2> */}
              <h3 className="font-bold">{pastoralLeader}</h3>
              <ul>
                {data
                  .filter((item) => item.pastoral_leader === pastoralLeader)
                  .map((item) => (
                    <li key={item.id} className="mb-2">
                      {/* Render the attendance details here */}
                      {/* You can use item properties like date, pastoralLeader, etc. */}
                      {`${item.firstname} ${item.lastname}`}
                    </li>
                  ))}
              </ul>
            </div>
          ));
        }

        // For other classifications, render as a single card
        return (
          <div
            key={classification}
            className={`p-4 rounded ${backgroundColor} my-4`}
          >
            <h2 className="text-xl font-bold mb-2">{classification}</h2>
            <ul>
              {data.map((item) => (
                <li key={item.id} className="mb-2">
                  {/* Render the attendance details here */}
                  {/* You can use item properties like date, pastoralLeader, etc. */}
                  {`${item.firstname} ${item.lastname}`}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default AttendanceGroupCard;
