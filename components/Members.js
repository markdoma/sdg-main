import { useState } from "react";
import membersData from "../utils/membersData";

const Members = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredMembers = membersData.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 py-8">
      <input
        type="text"
        placeholder="Search members"
        className="border border-gray-300 rounded-md p-2 mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <table className="w-full">
        <tbody>
          {filteredMembers.map((member) => (
            <tr key={member.id}>
              <td className="py-2">
                <img
                  src={`https://placekitten.com/50/50?image=${member.id}`}
                  alt={`Profile of ${member.name}`}
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="py-2">{member.name}</td>
              <td className="py-2">
                <span
                  className={`inline-block px-2 py-1 text-sm w-24 text-center rounded-md ${
                    member.badge === "Covenanted"
                      ? "bg-blue-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {member.badge}
                </span>
              </td>
              <td className="py-2">
                <button className="text-blue-500 hover:underline">
                  View Profile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Members;
