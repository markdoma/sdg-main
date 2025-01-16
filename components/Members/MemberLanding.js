import { useState } from "react";

export default function MemberLanding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const announcements = [
    "https://placeholder.pics/svg/300/5BFF20-CDFF74/test",
    "https://placeholder.pics/svg/300/4DFFC4-CDFF74/sdsd",
    "https://placeholder.pics/svg/300/FF0000-FF9595/sssss",
  ];

  const birthdayCelebrants = [
    "John Doe - Jan 1",
    "Jane Smith - Feb 2",
    "Alice Johnson - Mar 3",
  ];

  const weddingAnniversaries = [
    "John & Jane Doe - Jan 15",
    "Alice & Bob Johnson - Feb 20",
  ];

  const calendarOfEvents = [
    {
      id: 1,
      content: "Event 1",
      target: "Details",
      href: "#",
      date: "2023-10-01",
      datetime: "2023-10-01",
    },
    {
      id: 2,
      content: "Event 2",
      target: "Details",
      href: "#",
      date: "2023-10-02",
      datetime: "2023-10-02",
    },
    {
      id: 3,
      content: "Event 3",
      target: "Details",
      href: "#",
      date: "2023-10-03",
      datetime: "2023-10-03",
    },
  ];

  const mwgEvents = ["MWG Meeting - Jan 10", "Day of Prayer - Feb 15"];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % announcements.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + announcements.length) % announcements.length
    );
  };

  return (
    <div className="bg-transparent py-8 sm:py-8">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="card bg-transparent p-6 text-center border rounded-lg shadow-lg sm:col-span-2 hidden sm:block">
            <div className="relative flex justify-center items-center ">
              <img
                src={announcements[currentSlide]}
                alt="Announcement"
                className="md:w-1/3 md:h-1/3 w-6 h-6"
              />
              <div className="hidden sm:block">
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1"
                >
                  Prev
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1"
                >
                  Next
                </button>
              </div>
              <div className="block sm:hidden">
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1"
                >
                  &#9664;
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1"
                >
                  &#9654;
                </button>
              </div>
            </div>
          </div>
          <div className="card bg-transparent p-6 text-center border rounded-lg shadow-lg sm:row-span-2">
            <h2 className="text-lg font-semibold">Birthday Celebrants</h2>
            <ul className="mt-4">
              {birthdayCelebrants.map((celebrant, index) => (
                <li key={index} className="mt-2">
                  {celebrant}
                </li>
              ))}
            </ul>
            {weddingAnniversaries.length > 0 && (
              <>
                <h2 className="text-lg font-semibold mt-6">
                  Wedding Anniversaries
                </h2>
                <ul className="mt-4">
                  {weddingAnniversaries.map((anniversary, index) => (
                    <li key={index} className="mt-2">
                      {anniversary}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="card bg-transparent p-6 text-center border rounded-lg shadow-lg">
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {calendarOfEvents.map((event, eventIdx) => (
                  <li key={event.id}>
                    <div className="relative pb-8">
                      {eventIdx !== calendarOfEvents.length - 1 ? (
                        <span
                          aria-hidden="true"
                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white">
                            <svg
                              className="h-5 w-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <circle cx="10" cy="10" r="10" />
                            </svg>
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              {event.content}{" "}
                              <a
                                href={event.href}
                                className="font-medium text-gray-900"
                              >
                                {event.target}
                              </a>
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time dateTime={event.datetime}>{event.date}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card bg-transparent p-6 text-center border rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">MWG Events</h2>
            <ul className="mt-4">
              {mwgEvents.map((event, index) => (
                <li key={index} className="mt-2">
                  {event}
                </li>
              ))}
            </ul>
          </div>
          <div className="card bg-transparent p-6 text-center border rounded-lg shadow-lg sm:col-span-2">
            Card 5
          </div>
        </div>
      </div>
    </div>
  );
}
