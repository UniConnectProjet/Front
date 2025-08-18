import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import { EventCard } from "../../atoms";
import { WeekdayHeader } from "../../molecules";

const EmploiDuTemps = ({ events, onDatesSet }) => {
  const calendarRef = useRef(null);
  const [calendarView, setCalendarView] = useState(getInitialView());
  const [selectedDate, setSelectedDate] = useState(new Date());

  function getInitialView() {
    return window.innerWidth < 768 ? "timeGridDay" : "timeGridWeek";
  }

  useEffect(() => {
    const onResize = () => {
      const v = getInitialView();
      if (v !== calendarView) setCalendarView(v);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [calendarView]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    calendarRef.current?.getApi().gotoDate(newDate);
  };

  const renderEventContent = (info) => {
    const { title, extendedProps } = info.event;
    const professor = extendedProps?.professor;
    const location  = extendedProps?.location;

    return (
      <EventCard
        title={title}
        professor={professor}
        location={location}
        className="h-full w-full p-2 border-r-4 bg-primary-500 rounded"
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
        initialView={calendarView}
        initialDate={selectedDate}
        locale={frLocale}
        weekends={false}
        firstDay={1} 
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="19:00:00"
        eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
        events={events}
        eventContent={renderEventContent}
        height="auto"
        datesSet={onDatesSet}
      />
    </div>
  );
};

export default EmploiDuTemps;
