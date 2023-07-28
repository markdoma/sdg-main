import React from 'react';

export default function Example() {
  const handleChange = (event) => {
    // Handle the event selection here
    console.log(event.target.value);
  };

  const eventOptions = [
    { value: '2023-07-30', label: 'District Gathering' },
    { value: '2023-03-26', label: 'District Gathering' },
    { value: '2023-07-05', label: 'Open Door' },
  ];

  return (
    <div className="md:flex md:items-center md:justify-between md:space-x-5 mb-5">
      {' '}
      {/* Added 'mb-5' class here */}
      <div className="flex items-start space-x-5">
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              className="h-16 w-16 rounded-full"
              src="/summary.jpg"
              alt="Summary Report"
            />
            <span
              className="absolute inset-0 rounded-full shadow-inner"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="pt-1.5">
          <h1 className="text-2xl font-bold text-gray-900">Summary</h1>
          <p className="text-sm font-medium text-gray-500">
            Attendance for{' '}
            <a href="#" className="text-gray-900">
              {eventOptions[0].label}
            </a>{' '}
            on <time dateTime={eventOptions[0].value}>July 30, 2023</time>
          </p>
        </div>
      </div>
      <div className="relative mt-6">
        <select
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 shadow-sm bg-white focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition ease-in-out duration-150 text-sm font-medium text-gray-900 py-2 pr-10 pl-4 border border-gray-300 rounded-md appearance-none"
        >
          {eventOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {`${value.slice(8, 10)}/${value.slice(5, 7)}/${value.slice(
                0,
                4
              )} - ${label}`}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
