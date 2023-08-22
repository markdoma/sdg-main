import { db } from '../utils/firebase';

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

// Function to add a new attendance record to the "attendance" collection
const addAttendanceRecord = (
  event,
  id,
  no,
  firstName,
  lastName,
  pl,
  invitedBy,
  sdg_class,
  first
) => {
  const newAttendanceRecord = {
    date: new Date(event.start.dateTime), // Replace with the actual event date from Google Calendar
    event: event.summary, // Replace with the actual event name from Google Calendar
    id: id,
    no: no,
    firstname: capitalizeName(firstName),
    lastname: capitalizeName(lastName),
    pastoral_leader: pl,
    invitedBy: invitedBy,
    sdg_class: sdg_class,
    first_timer: first,
  };
  db.collection('master_data')
    .doc(id)
    .collection('attendance')
    // db.collection('attendance')
    .add(newAttendanceRecord)
    .then((docRef) => {
      console.log('Attendance record added with ID: ', docRef.id);
      // If you need to do anything after successfully adding the record, you can put it here.
    })
    .catch((error) => {
      console.error('Error adding attendance record: ', error);
    });

  setIsPresentButtonClicked(true);
};
