import React, { useState } from "react";

const WithPastoralLeader = () => {
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [pastoralLeaders, setPastoralLeaders] = useState([
    {
      id: 1,
      date: "2023-07-15",
      name: "John Doe",
      leader: "Leader A",
      attendance: true,
    },
    {
      id: 2,
      date: "2023-07-16",
      name: "Jane Smith",
      leader: "Leader A",
      attendance: true,
    },
    {
      id: 3,
      date: "2023-07-17",
      name: "Michael Johnson",
      leader: "Leader A",
      attendance: true,
    },
    {
      id: 4,
      date: "2023-07-18",
      name: "Emily Davis",
      leader: "Leader A",
      attendance: true,
    },
    {
      id: 5,
      date: "2023-07-19",
      name: "Daniel Wilson",
      leader: "Leader B",
      attendance: true,
    },
    {
      id: 6,
      date: "2023-07-20",
      name: "Olivia Thompson",
      leader: "Leader B",
      attendance: true,
    },
    {
      id: 7,
      date: "2023-07-21",
      name: "Matthew Anderson",
      leader: "Leader B",
      attendance: true,
    },
    {
      id: 8,
      date: "2023-07-22",
      name: "Ava Martinez",
      leader: "Leader C",
      attendance: true,
    },
    {
      id: 9,
      date: "2023-07-23",
      name: "Jacob Taylor",
      leader: "Leader C",
      attendance: true,
    },
    {
      id: 10,
      date: "2023-07-24",
      name: "Sophia Clark",
      leader: "Leader D",
      attendance: true,
    },
    {
      id: 11,
      date: "2023-07-25",
      name: "William Rodriguez",
      leader: "Leader E",
      attendance: true,
    },
    {
      id: 12,
      date: "2023-07-26",
      name: "Isabella Hill",
      leader: "Leader E",
      attendance: true,
    },
    {
      id: 13,
      date: "2023-07-27",
      name: "Joseph Baker",
      leader: "Leader F",
      attendance: true,
    },
    {
      id: 14,
      date: "2023-07-28",
      name: "Mia Lee",
      leader: "Leader F",
      attendance: true,
    },
    {
      id: 15,
      date: "2023-07-29",
      name: "David Torres",
      leader: "Leader G",
      attendance: true,
    },
    {
      id: 16,
      date: "2023-07-30",
      name: "Emma Mitchell",
      leader: "Leader G",
      attendance: true,
    },
    {
      id: 17,
      date: "2023-07-31",
      name: "Benjamin Carter",
      leader: "Leader G",
      attendance: true,
    },
    {
      id: 18,
      date: "2023-08-01",
      name: "Abigail Walker",
      leader: "Leader F",
      attendance: true,
    },
    {
      id: 19,
      date: "2023-08-02",
      name: "Andrew Perez",
      leader: "Leader A",
      attendance: true,
    },
    {
      id: 20,
      date: "2023-08-03",
      name: "Sofia Gonzales",
      leader: "Leader B",
      attendance: true,
    },
  ]);

  const uniqueLeaders = [
    ...new Set(pastoralLeaders.map((leader) => leader.leader)),
  ];

  const handleClick = (leader) => {
    setSelectedLeader(leader);
  };

  const handleToggleAttendance = (id) => {
    const updatedLeaders = pastoralLeaders.map((leader) => {
      if (leader.id === id) {
        return {
          ...leader,
          attendance: !leader.attendance,
        };
      }
      return leader;
    });
    setPastoralLeaders(updatedLeaders);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-4">Pastoral Leaders</h2>
          <div className="space-y-4">
            {uniqueLeaders.map((leader, index) => (
              <div
                key={index}
                className={`cursor-pointer p-4 border rounded-lg ${
                  selectedLeader === leader
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => handleClick(leader)}
              >
                <p className="font-bold">{leader}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          {selectedLeader && (
            <div>
              <h3 className="text-lg font-bold mb-4">
                Members assigned to {selectedLeader}
              </h3>
              <div className="space-y-4">
                {pastoralLeaders
                  .filter((leader) => leader.leader === selectedLeader)
                  .map((leader) => (
                    <div key={leader.id} className="flex space-x-4">
                      <div
                        className="w-40 p-4 border rounded-lg border-gray-300 cursor-pointer"
                        onClick={() => handleToggleAttendance(leader.id)}
                      >
                        <p>{leader.name}</p>
                      </div>
                      <div
                        className={`w-40 flex justify-center items-center ${
                          leader.attendance ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        <div className="text-white px-2 py-1 rounded">
                          {leader.attendance ? "Present" : "Absent"}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithPastoralLeader;
