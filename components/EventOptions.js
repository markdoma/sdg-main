import React, { useState, useContext } from 'react';
import EventContext from '@/context/eventContext';

function EventOptions({ eventOptions }) {
  const [selectedEvent, setSelectedEvent] = useContext(EventContext);

  const handleChange = (event) => {
    // Handle the event selection here
    const dateObject = new Date(event.target.value).toLocaleDateString('en-US');
    // console.log(dateObject);
    setSelectedEvent(dateObject);
    // console.log(selectedEvent);
  };

  return (
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
  );
}

export default EventOptions;
