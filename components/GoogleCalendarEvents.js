import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import axios from "axios";

function generateMonths(numMonths, startMonth, eventsData) {
  const months = [];
  let currentDate = new Date(startMonth);

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]; // Corrected weekday names

  for (let i = 0; i < numMonths; i++) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    for (let j = 1; j <= lastDay.getDate(); j++) {
      const date = new Date(year, month, j).toISOString().slice(0, 10);
      const dayEvents = eventsData[date] || [];
      const hasEvent = dayEvents.length > 0;

      days.push({ date, events: dayEvents, hasEvent });
    }

    months.push({
      name: currentDate.toLocaleString("default", { month: "long" }),
      daysOfWeek, // Set the corrected weekday names here
      days,
    });

    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return months;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Helper function to format time in 12-hour AM/PM format
const formatTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleString(undefined, {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const GoogleCalendarEvents = () => {
  const [months, setMonths] = useState([]);
  const [eventsByMonth, setEventsByMonth] = useState({});
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/calendar/v3/calendars/ligayasdg@gmail.com/events`,
          {
            params: {
              key: "AIzaSyC0OBwnEO2n244bIYqjhvTkdo1_QaZIjtY",
            },
          }
        );

        // Process the events data and organize them by month
        const events = response.data.items.map((item) => ({
          id: item.id,
          summary: item.summary,
          description: item.description,
          start: {
            dateTime: item.start.dateTime || item.start.date,
          },
          end: {
            dateTime: item.end.dateTime || item.end.date,
          },
        }));

        const eventsByMonthData = {};
        events.forEach((event) => {
          const eventMonth = new Date(event.start.dateTime)
            .toISOString()
            .slice(0, 7);
          if (!eventsByMonthData[eventMonth]) {
            eventsByMonthData[eventMonth] = [];
          }
          eventsByMonthData[eventMonth].push(event);
        });

        setEventsByMonth(eventsByMonthData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  useEffect(() => {
    // Generate 3 months starting from the current month
    const numMonths = 2;
    const startMonth = new Date().toISOString().slice(0, 7);
    const generatedMonths = generateMonths(
      numMonths,
      startMonth,
      eventsByMonth
    );
    setMonths(generatedMonths);
  }, [eventsByMonth]);
  useEffect(() => {
    // Get the next 3 upcoming events sorted by date
    const now = new Date().toISOString();
    const allEvents = Object.values(eventsByMonth).flat();
    const upcomingEventsSorted = allEvents
      .filter((event) => event.start.dateTime >= now)
      .sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime))
      .slice(0, 10);

    setUpcomingEvents(upcomingEventsSorted);
  }, [eventsByMonth]);

  return (
    <div>
      <div className="relative grid grid-cols-1 gap-x-14 md:grid-cols-2">
        <button
          type="button"
          className="absolute -left-1.5 -top-1 flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="absolute -right-1.5 -top-1 flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        {months.map((month, monthIdx) => (
          <section
            key={monthIdx}
            className={classNames(
              monthIdx === months.length - 1 && "hidden md:block",
              "text-center"
            )}
          >
            <h2 className="text-sm font-semibold text-gray-900">
              {month.name}
            </h2>
            <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
              <div>S</div>
            </div>
            <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
              {month.days.map((day, dayIdx) => (
                <button
                  key={day.date}
                  type="button"
                  className={classNames(
                    day.hasEvent
                      ? "text-red-600"
                      : day.isCurrentMonth
                      ? "bg-white text-gray-900"
                      : "bg-gray-50 text-gray-400",
                    dayIdx === 0 && "rounded-tl-lg",
                    dayIdx === 6 && "rounded-tr-lg",
                    dayIdx === month.days.length - 7 && "rounded-bl-lg",
                    dayIdx === month.days.length - 1 && "rounded-br-lg",
                    "relative py-1.5 hover:bg-gray-100 focus:z-10"
                  )}
                >
                  <time
                    dateTime={day.date}
                    className={classNames(
                      day.isToday && "bg-indigo-600 font-semibold text-white",
                      "mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                    )}
                  >
                    {day.date.split("-").pop().replace(/^0/, "")}
                  </time>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
      <section className="mt-12">
        <h2 className="text-base font-semibold leading-6 text-gray-900">
          Upcoming events
        </h2>
        <ol className="mt-2 divide-y divide-gray-200 text-sm leading-6 text-gray-500">
          {upcomingEvents.map((event) => (
            <li key={event.id} className="py-4 sm:flex">
              <time dateTime={event.start.dateTime} className="w-28 flex-none">
                {new Date(event.start.dateTime).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <p className="mt-2 flex-auto font-semibold text-gray-900 sm:mt-0">
                {event.summary}
              </p>
              <p className="flex-none sm:ml-6">
                <time dateTime={event.start.dateTime}>
                  {new Date(event.start.dateTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </time>{" "}
                -{" "}
                <time dateTime={event.end.dateTime}>
                  {new Date(event.end.dateTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </time>
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};
export default GoogleCalendarEvents;
