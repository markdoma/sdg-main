import React, { useState } from "react";

const AttendanceSelector = () => {
  const initialMembers = [
    { id: 1, name: "Member 1" },
    { id: 2, name: "Member 2" },
    { id: 3, name: "Member 3" },
    { id: 4, name: "Member 4" },
    { id: 5, name: "Member 5" },
  ];

  const [box1Members, setBox1Members] = useState(initialMembers);
  const [box2Members, setBox2Members] = useState([]);
  const [selectedBox1Members, setSelectedBox1Members] = useState([]);
  const [selectedBox2Members, setSelectedBox2Members] = useState([]);

  const toggleSelectMember = (memberId) => {
    if (selectedBox1Members.includes(memberId)) {
      setSelectedBox1Members(
        selectedBox1Members.filter((id) => id !== memberId)
      );
    } else {
      setSelectedBox1Members([...selectedBox1Members, memberId]);
    }
  };

  const toggleSelectMemberFromBox2 = (memberId) => {
    if (selectedBox2Members.includes(memberId)) {
      setSelectedBox2Members(
        selectedBox2Members.filter((id) => id !== memberId)
      );
    } else {
      setSelectedBox2Members([memberId]);
    }
  };

  const moveSelectedMembersToBox2 = () => {
    const updatedMembers = box1Members.filter(
      (member) => !selectedBox1Members.includes(member.id)
    );
    const selected = box1Members.filter((member) =>
      selectedBox1Members.includes(member.id)
    );
    setBox1Members(updatedMembers);
    setBox2Members([...box2Members, ...selected]);
    setSelectedBox1Members([]);
  };

  const moveSelectedMembersToBox1 = () => {
    const updatedMembers = box2Members.filter(
      (member) => !selectedBox2Members.includes(member.id)
    );
    const selected = box2Members.filter((member) =>
      selectedBox2Members.includes(member.id)
    );
    setBox2Members(updatedMembers);
    setBox1Members([...box1Members, ...selected]);
    setSelectedBox2Members([]);
  };

  const filterMembers = (searchTerm) => {
    const filteredBox1Members = initialMembers.filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredBox2Members = box2Members.filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { filteredBox1Members, filteredBox2Members };
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBox1Members, setFilteredBox1Members] = useState([]);
  const [filteredBox2Members, setFilteredBox2Members] = useState([]);

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === "") {
      // If search term is empty, return the original box1Members and box2Members
      setFilteredBox1Members(box1Members);
      setFilteredBox2Members(box2Members);
    } else {
      // Filter initial members based on the search term
      // const filteredBox1Members = initialMembers.filter((member) =>
      //   member.name.toLowerCase().includes(searchTerm.toLowerCase())
      // );

      setFilteredBox1Members(
        box1Members.filter((member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      // Filter box2Members based on the search term
      // const filteredBox2Members = box2Members.filter((member) =>
      //   member.name.toLowerCase().includes(searchTerm.toLowerCase())

      setFilteredBox2Members(
        box2Members.filter((member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      // Render the filtered members directly in the JSX without updating the states
      // return filteredBox1Members, filteredBox2Members;
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <AttendanceMemberSearch onSearch={handleSearch} /> */}
      <div>
        <h2>Search Members</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div
        style={{ border: "1px solid black", padding: "10px", margin: "10px" }}
      >
        <h2>Available Members</h2>
        <ul>
          {filteredBox1Members
            ? filteredBox1Members.map((member) => (
                <li
                  key={member.id}
                  onClick={() => toggleSelectMember(member.id)}
                  style={{
                    backgroundColor: selectedBox1Members.includes(member.id)
                      ? "lightblue"
                      : "inherit",
                    cursor: "pointer",
                  }}
                >
                  {member.name}
                </li>
              ))
            : box1Members.map((member) => (
                <li
                  key={member.id}
                  onClick={() => toggleSelectMember(member.id)}
                  style={{
                    backgroundColor: selectedBox1Members.includes(member.id)
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
          {box2Members.map((member) => (
            <li
              key={member.id}
              onClick={() => toggleSelectMemberFromBox2(member.id)}
              style={{
                backgroundColor: selectedBox2Members.includes(member.id)
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
    </div>
  );
};

export default AttendanceSelector;
