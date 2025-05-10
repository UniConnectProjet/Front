import React from "react";
import PropTypes from "prop-types";

const NextDayCourses = ({ events }) => {
  if (events.length === 0) {
    return <p className="text-gray-500">Aucun cours prévu demain.</p>;
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow mb-10">
      <h2 className="text-lg font-bold text-primary-600 mb-4">Prochains cours</h2>
      {events.map((event) => (
        <div key={event.id} className="bg-blue-100 p-3 mb-2 rounded">
          <p className="font-semibold">Matière : {event.title}</p>
          <p>Intervenant : {event.extendedProps.professor}</p>
          <p>Salle : {event.extendedProps.location}</p>
          <p>
            Horaire :{" "}
            {new Date(event.start).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(event.end).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ))}
    </div>
  );
};

NextDayCourses.propTypes = {
  events: PropTypes.array.isRequired,
};

export default NextDayCourses;