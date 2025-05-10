// organisms/EmploiDuTemps.jsx
import React from "react";
import PropTypes from "prop-types";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { EventCard } from "../../atoms";
import "./EmploiDuTemps.css"; // Assuming you have some CSS for styling

const EmploiDuTemps = ({ events }) => {
  const renderEventContent = (eventInfo) => {
    const { title, extendedProps } = eventInfo.event;

    return (
      <EventCard
        title={title}
        professor={extendedProps.professor}
        location={extendedProps.location}
      />
    );
  };

  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      locale={frLocale}
      firstDay={1}
      allDaySlot={false}
      slotMinTime="08:00:00"
      slotMaxTime="20:00:00"
      events={events}
      eventContent={renderEventContent}
      height="auto"
    />
  );
};

EmploiDuTemps.propTypes = {
    events: PropTypes.arrayOf(
        PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired,
        extendedProps: PropTypes.shape({
            professor: PropTypes.string,
            location: PropTypes.string,
        }),
        })
    ).isRequired,
};  

export default EmploiDuTemps;
