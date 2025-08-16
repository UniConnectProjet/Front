import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { EventCard } from "../../atoms";
import { WeekdayHeader } from "../../molecules";

const EmploiDuTemps = ({ events }) => {
  const calendarRef = useRef(null);
  const [calendarView, setCalendarView] = useState(getInitialView());
  const [selectedDate, setSelectedDate] = useState(new Date());

  function getInitialView() {
    return window.innerWidth < 768 ? "timeGridDay" : "timeGridWeek";
  }

  useEffect(() => {
    const handleResize = () => {
      const newView = getInitialView();
      if (newView !== calendarView) setCalendarView(newView);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calendarView]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    calendarRef.current?.getApi().gotoDate(newDate);
  };

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
    <div className="overflow-x-auto w-full">
      <WeekdayHeader selectedDate={selectedDate} onSelect={handleDateChange} />
      <FullCalendar
        key={calendarView}
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={selectedDate}
        locale={frLocale}
        firstDay={1}
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        events={events}
        eventContent={renderEventContent}
        height="auto"
      />
    </div>
  );
};

export default EmploiDuTemps;