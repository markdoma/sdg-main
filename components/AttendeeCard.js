import { PhoneIcon } from '@heroicons/react/solid';

const AttendeeCard = ({ person }) => {
  return (
    <li
      key={person.email}
      className="col-span-1 p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition duration-300"
    >
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {person.firstname} {person.lastname}
          </h3>
          <p className="text-sm text-gray-500">{person.title}</p>
          <p className="text-sm text-gray-500">Age: {person.age}</p>
        </div>
        <a
          href={`tel:${person.telephone}`}
          className="text-blue-500 hover:text-blue-700"
        >
          {/* <PhoneIcon className="h-5 w-5" aria-hidden="true" /> */}
        </a>
      </div>
      {/* <div className="mt-4">
        <p className="text-sm text-gray-600">{person.email}</p>
      </div> */}
    </li>
  );
};

export default AttendeeCard;
