import React, { useContext, useState } from 'react';
import EventContext from '@/context/eventContext';
import EventOptions from '../components/EventOptions';

export default function PageHeading({ eventsOptions }) {
  // const eventOptions = [
  //   { value: '2023-07-30', label: 'July District Gathering' },
  //   { value: '2023-03-26', label: 'March District Gathering' },
  //   { value: '2023-08-06', label: 'August Open Door' },
  // ];

  // console.log(eventsOptions);
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
              {eventsOptions.label}
            </a>{' '}
            on <time dateTime={eventsOptions.value}>----</time>
          </p>
        </div>
      </div>
      <div className="relative mt-6">
        <EventOptions eventsOptions={eventsOptions} />
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
