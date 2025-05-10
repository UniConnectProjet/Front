import React from "react";
import PropTypes from "prop-types";

const EventCard = ({ title, professor, location, className = "" }) => {

  return (
    <div className={`flex p-1 mr-4 items-center w-full border-l border-primary-500 ${className}`}>
      <div className="flex flex-col justify-between p-2 bg-primary-100 rounded shadow">
        <p className="text-sm font-bold text-primary-500 py-3">Matière : {title}</p>
        <p className="text-sm font-bold text-primary-500 py-3">Intervenant : {professor}</p>
        <p className="text-sm font-bold text-primary-500 py-3">{location}</p>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  title: PropTypes.string.isRequired,
  professor: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default EventCard;
