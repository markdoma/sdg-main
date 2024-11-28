import React, { useState, useContext, useEffect } from "react";
import EventContext from "@/context/eventContext";

function EventOptions({ eventsOptions }) {
  // const [selectedEvent, setSelectedEvent] = useContext(EventContext);
  const [selectedEvent, setSelectedEvent] = useState(eventsOptions[0]);

  console.log(`${eventsOptions} - from eventsOPtions`);
  const handleChange = (event) => {
    // Handle the event selection here
    const dateObject = new Date(event.target.value).toLocaleDateString("en-US");
    // console.log(dateObject);
    setSelectedEvent(dateObject);
    // console.log(selectedEvent);
  };

  useEffect(() => {
    // Sort eventsOptions by date before setting the initial selected event
    const sortedEventsOptions = eventsOptions.slice().sort((a, b) => {
      const dateA = new Date(a.value);
      const dateB = new Date(b.value);
      return dateA - dateB;
    });
    console.log(sortedEventsOptions);
    // Set the initial selected event to the last date when the component mounts
    const lastDate =
      sortedEventsOptions.length > 0
        ? sortedEventsOptions[sortedEventsOptions.length - 1].value
        : "";
    setSelectedEvent(new Date(lastDate).toLocaleDateString("en-US"));
  }, [eventsOptions, setSelectedEvent]);

  return (
    <select
      // defaultValue={lastDate} // Set the default value to the last date
      value={selectedEvent} // Set the default value to the last date
      onChange={handleChange}
      className="block w-full rounded-md border-gray-300 shadow-sm bg-white focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition ease-in-out duration-150 text-sm font-medium text-gray-900 py-2 pr-10 pl-4 border border-gray-300 rounded-md appearance-none"
    >
      {eventsOptions.map(({ value, label, key }) => (
        <option key={key} value={value}>
          {/* {`${value.slice(8, 10)}/${value.slice(5, 7)}/${value.slice(
            0,
            4
          )} - ${label}`} */}
          {`${value} - ${label}`}
        </option>
      ))}
    </select>
  );
}

export default EventOptions;
