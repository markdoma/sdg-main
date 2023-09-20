// Capitalize Names
export const capitalizeName = (name) => {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Fetch Calendar events
export const getEventDetailsFromGoogleCalendar = async () => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/ligayasdg@gmail.com/events`,
      {
        params: {
          // key: 'AIzaSyC0OBwnEO2n244bIYqjhvTkdo1_QaZIjtY',
          key: 'AIzaSyC0OBwnEO2n244bIYqjhvTkdo1_QaZIjtY',
        },
      }
    );
    const currentDate = new Date();
    // const data = await response.json();
    const data = response.data.items;
    const eventsForCurrentDay = data.filter((event) => {
      const eventDate = new Date(event.start.dateTime);

      return eventDate.toDateString() === currentDate.toDateString();
    });

    return eventsForCurrentDay.length > 0 ? eventsForCurrentDay[0] : null;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};
