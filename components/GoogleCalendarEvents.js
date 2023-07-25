import { useEffect, useState } from "react";
import axios from "axios";

import Loading from "../components/Loading";

const GoogleCalendarEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch environment variables
  // const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;
  // const calendarId = process.env.GOOGLE_CALENDAR_ID;

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/calendar/v3/calendars/d20fe633f3fe30ea5280b5e9ecbdc661a20a78eabbee74a4d6e33ffad1c03fb0@group.calendar.google.com/events`,
          {
            params: {
              key: "AIzaSyC0OBwnEO2n244bIYqjhvTkdo1_QaZIjtY",
            },
          }
        );
        setEvents(response.data.items);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Google Calendar Events</h2>
      {loading ? ( // Check if data is still loading
        <Loading /> // Display the loading component if loading is true
      ) : events.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">{event.summary}</h3>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-gray-500 mt-2">
                Start: {event.start.dateTime || event.start.date}
              </p>
              <p className="text-gray-500">
                End: {event.end.dateTime || event.end.date}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default GoogleCalendarEvents;
