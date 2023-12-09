import React, { useState } from 'react';

function InitMemberTable() {
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'John Doe',
      district: 'District A',
      courses: [
        { status: false, date: '' },
        { status: true, date: 'June 2023' },
        { status: false, date: '' },
        { status: true, date: 'July 2023' },
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      district: 'District B',
      courses: [
        { status: true, date: 'May 2023' },
        { status: true, date: 'June 2023' },
        { status: false, date: '' },
        { status: true, date: 'July 2023' },
      ],
    },
  ]);
  const [newMember, setNewMember] = useState({
    name: '',
    district: '',
    courses: [false, false, false, false],
  });
  const [showForm, setShowForm] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [memberIndexToRemoveDate, setMemberIndexToRemoveDate] = useState(null);
  const [courseIndexToRemoveDate, setCourseIndexToRemoveDate] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editMemberIndex, setEditMemberIndex] = useState(null);
  const [editCourseIndex, setEditCourseIndex] = useState(null);

  const handleAddMember = () => {
    setMembers([...members, newMember]);
    setNewMember({
      name: '',
      district: '',
      courses: [false, false, false, false],
    });
    setShowForm(false);
  };

  const handleConfirmRemoveDate = () => {
    const updatedMembers = [...members];
    updatedMembers[memberIndexToRemoveDate].courses[
      courseIndexToRemoveDate
    ] = false;
    setConfirmationModal(false);
    setMembers(updatedMembers);
  };

  const handleEditDate = (memberIndex, courseIndex, date) => {
    setEditMemberIndex(memberIndex);
    setEditCourseIndex(courseIndex);
    setEditModal(true);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const [dateModal, setDateModal] = useState(false); // Define dateModal state
  const [selectedMonth, setSelectedMonth] = useState(''); // State for selected month
  const [selectedYear, setSelectedYear] = useState(''); // State for selected year
  const handleSaveEditedDate = () => {
    if (selectedMonth && selectedYear) {
      const editedDate = `${selectedMonth} ${selectedYear}`;
      const updatedMembers = [...members];
      const courseToUpdate =
        updatedMembers[memberIndexToRemoveDate].courses[
          courseIndexToRemoveDate
        ];
      updatedMembers[memberIndexToRemoveDate].courses[courseIndexToRemoveDate] =
        {
          ...courseToUpdate,
          status: true, // Mark as completed
          date: editedDate, // Set completion date
        };
      setMembers(updatedMembers);
    }
    setDateModal(false);
  };
  return (
    <div className="p-4">
      <button
        className="bg-blue-500 text-white rounded px-4 py-2 mb-4"
        onClick={toggleForm}
      >
        + Add Member
      </button>
      {showForm && (
        <form className="mb-4">
          {/* ... Your form input fields ... */}
          <button
            className="bg-blue-500 text-white rounded px-4 py-2 mt-4"
            onClick={handleAddMember}
          >
            Add Member
          </button>
        </form>
      )}
      <table className="table-fixed w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="w-1/4 border p-2">Name</th>
            <th className="w-1/4 border p-2">District</th>
            <th className="w-1/4 border p-2">Course 1</th>
            <th className="w-1/4 border p-2">Course 2</th>
            <th className="w-1/4 border p-2">Course 3</th>
            <th className="w-1/4 border p-2">Course 4</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, memberIndex) => (
            <tr key={member.id}>
              <td className="border p-2">{member.name}</td>
              <td className="border p-2">{member.district}</td>
              {member.courses.map((course, courseIndex) => (
                <td key={courseIndex} className="border p-2 text-center">
                  {course.status ? (
                    <button
                      onClick={() => {
                        setMemberIndexToRemoveDate(memberIndex);
                        setCourseIndexToRemoveDate(courseIndex);
                        setConfirmationModal(true);
                      }}
                      className="bg-green-500 text-white rounded px-2 py-1"
                    >
                      Completed
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setMemberIndexToRemoveDate(memberIndex);
                        setCourseIndexToRemoveDate(courseIndex);
                        setDateModal(true);
                      }}
                      className="bg-red-500 text-white rounded px-2 py-1"
                    >
                      Not Completed
                    </button>
                  )}
                  {course.status && <div>{course.date}</div>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {confirmationModal && (
        <div className="modal flex items-center justify-center">
          <div className="bg-white p-4 rounded border shadow-lg">
            <p>
              Are you sure you want to make this Not Completed? If so, the
              completion date will be deleted.
            </p>
            <button
              onClick={handleConfirmRemoveDate}
              className="bg-red-500 text-white rounded px-2 py-1"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmationModal(false)}
              className="bg-gray-500 text-white rounded px-2 py-1 ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {dateModal && (
        <div className="modal flex items-center justify-center">
          <div className="bg-white p-4 rounded border shadow-lg">
            <p>Select the completion date:</p>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-2 py-1 my-2"
            >
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              {/* Add more months as needed */}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-2 py-1 my-2"
            >
              <option value="">Select Year</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              {/* Add more years as needed */}
            </select>
            <button
              onClick={handleSaveEditedDate}
              className="bg-green-500 text-white rounded px-2 py-1"
            >
              Save
            </button>
            <button
              onClick={() => setDateModal(false)}
              className="bg-gray-500 text-white rounded px-2 py-1 ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InitMemberTable;
