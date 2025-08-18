import React from "react";
import PropTypes from "prop-types";

const EventCard = ({ title, professor, location, className = "" }) => {
  return (
    <div className={`flex flex-col w-full h-full p-2 ${className}`}>
      <div className="font-semibold">Matière : {title}</div>
      {professor && <div className="meta">Intervenant : {professor}</div>}
      {location && <div className="meta">{location}</div>}
    </div>
  );
};

EventCard.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  professor: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
};

export default EventCard;
