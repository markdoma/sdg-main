import React, { useState } from "react";

const AttendanceSelector = () => {
  const initialMembers = [
    { id: 1, name: "Member 1" },
    { id: 2, name: "Member 2" },
    { id: 3, name: "Member 3" },
    { id: 4, name: "Member 4" },
    { id: 5, name: "Member 5" },
  ];

  const [members, setMembers] = useState(initialMembers);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedMembersFromBox2, setSelectedMembersFromBox2] = useState([]);

  const toggleSelectMember = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const toggleSelectMemberFromBox2 = (memberId) => {
    if (selectedMembersFromBox2.includes(memberId)) {
      setSelectedMembersFromBox2(
        selectedMembersFromBox2.filter((id) => id !== memberId)
      );
    } else {
      setSelectedMembersFromBox2([...selectedMembersFromBox2, memberId]);
    }
  };

  const moveSelectedMembersToBox2 = () => {
    const updatedMembers = members.filter(
      (member) => !selectedMembers.includes(member.id)
    );
    const selected = members.filter((member) =>
      selectedMembers.includes(member.id)
    );
    setMembers(updatedMembers);
    setSelectedMembersFromBox2([
      ...selectedMembersFromBox2,
      ...selected.map((member) => member.id),
    ]);
    setSelectedMembers([]);
  };

  const moveSelectedMembersToBox1 = () => {
    const updatedSelected = selectedMembers.filter(
      (memberId) => !selectedMembersFromBox2.includes(memberId)
    );
    const selected = selectedMembersFromBox2.map((id) =>
      initialMembers.find((m) => m.id === id)
    );
    setSelectedMembers(updatedSelected);
    setMembers([...members, ...selected]);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{ border: "1px solid black", padding: "10px", margin: "10px" }}
      >
        <h2>Available Members</h2>
        <ul>
          {members.map((member) => (
            <li
              key={member.id}
              onClick={() => toggleSelectMember(member.id)}
              style={{
                backgroundColor: selectedMembers.includes(member.id)
                  ? "lightblue"
                  : "inherit",
                cursor: "pointer",
              }}
            >
              {member.name}
            </li>
          ))}
        </ul>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "0 10px",
        }}
      >
        <button onClick={moveSelectedMembersToBox2}>{">>"}</button>
        <button onClick={moveSelectedMembersToBox1}>{"<<"}</button>
      </div>
      <div
        style={{ border: "1px solid black", padding: "10px", margin: "10px" }}
      >
        <h2>Selected Members</h2>
        <ul>
          {selectedMembersFromBox2.map((memberId) => {
            const member = initialMembers.find((m) => m.id === memberId);
            return (
              <li
                key={member.id}
                onClick={() => toggleSelectMemberFromBox2(member.id)}
                style={{
                  backgroundColor: selectedMembersFromBox2.includes(member.id)
                    ? "lightblue"
                    : "inherit",
                  cursor: "pointer",
                }}
              >
                {member.name}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AttendanceSelector;
