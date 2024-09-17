export default function AttendanceData({ attendance }) {
  // Sort attendance data by date in descending order
  const sortedAttendance = [...attendance].sort((a, b) => {
    // Assuming `date` is in ISO 8601 format or can be parsed by Date
    return new Date(b.date) - new Date(a.date);
  });
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-6 sm:px-6">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Attendance Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          List of events
        </p>
      </div>
      <div className="border-t border-gray-100">
        {sortedAttendance.length > 0 ? (
          <div className="px-4 py-6 sm:px-6">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Event
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {sortedAttendance.map((item, index) => (
                  <tr key={index}>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {item.event}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {item.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-4 py-6 sm:px-6">
            <p className="text-center mt-4">No attendance records found</p>
          </div>
        )}
      </div>
    </div>
  );
}
