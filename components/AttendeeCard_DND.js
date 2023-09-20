import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const AttendeeCard_DND = ({
  person,
  groupIndex,
  droppableId,
  attendeeIndex,
  handleDragEnd,
}) => {
  return (
    <Draggable draggableId={droppableId} index={attendeeIndex}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="col-span-1 p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition duration-300"
        >
          <div
            className="flex items-center space-x-4"
            // Use the handleDragEnd function when drag ends
            onClick={() =>
              handleDragEnd({
                source: {
                  index: attendeeIndex,
                  groupIndex: groupIndex,
                  droppableId: droppableId,
                },
                destination: {
                  index: attendeeIndex,
                  groupIndex: groupIndex,
                  droppableId: droppableId,
                },
              })
            }
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {person.firstname} {person.lastname}
              </h3>
              <p className="text-sm text-gray-500">{person.title}</p>
              <p className="text-sm text-gray-500">Age: {person.age}</p>
            </div>
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default AttendeeCard_DND;
