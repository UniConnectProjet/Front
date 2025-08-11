// src/pages/PlanningPage.jsx
import React, { useRef, lazy, Suspense, useEffect, useState } from "react";

const EmploiDuTemps = lazy(() =>
  import("../../components/organisms").then(m => ({ default: m.EmploiDuTemps }))
);
const SideBar = lazy(() =>
  import("../../components/organisms").then(m => ({ default: m.SideBar }))
);

// Exemple de données statiques (à remplacer plus tard par un fetch API)
const mockEvents = [
  {
    id: "1",
    title: "Full Stack",
    start: "2025-05-16T08:00:00",
    end: "2025-05-16T12:00:00",
    extendedProps: {
      professor: "Mme Perez",
      location: "Salle 023",
    },
  },
  {
    id: "2",
    title: "Full Stack",
    start: "2025-05-16T16:00:00",
    end: "2025-05-16T18:00:00",
    extendedProps: {
      professor: "Mme Perez",
      location: "Salle 023",
    },
  },
  {
    id: "3",
        title: "Full Stack",
        start: "2025-05-12T08:00:00",
        end: "2025-05-12T12:00:00",
        extendedProps: {
        professor: "Mme Perez",
        location: "Salle 023",
        },
  },
  {
    id: "4",
    title: "Full Stack",
    start: "2025-05-12T14:00:00",
    end: "2025-05-12T17:00:00",
    extendedProps: {
      professor: "Mme Perez",
      location: "Salle 023",
    },
  },
  {
    id: "5",
        title: "Full Stack",
        start: "2025-05-13T08:00:00",
        end: "2025-05-13T12:00:00",
        extendedProps: {
        professor: "Mme Perez",
        location: "Salle 023",
        },
  },
  {
    id: "6",
    title: "Full Stack",
    start: "2025-05-13T14:00:00",
    end: "2025-05-13T17:00:00",
    extendedProps: {
      professor: "Mme Perez",
      location: "Salle 023",
    },
  },
  {
    id: "7",
        title: "Full Stack",
        start: "2025-05-14T08:00:00",
        end: "2025-05-14T12:00:00",
        extendedProps: {
        professor: "Mme Perez",
        location: "Salle 023",
        },
  },
  {
    id: "8",
    title: "Full Stack",
    start: "2025-05-14T14:00:00",
    end: "2025-05-14T17:00:00",
    extendedProps: {
      professor: "Mme Perez",
      location: "Salle 023",
    },
  },

];

const PlanningPage = () => {
  const calendarRef = useRef(null);
  const [setDateLabel] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const id =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => setShowCalendar(true))
        : setTimeout(() => setShowCalendar(true), 0);
    return () =>
      "cancelIdleCallback" in window ? window.cancelIdleCallback(id) : clearTimeout(id);
  }, []);

  // Quand la vue change de semaine, met à jour le label
  const handleDatesSet = (info) => {
    const start = new Date(info.start);
    const end = new Date(info.end);
    const format = (d) =>
      d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
    setDateLabel(`Semaine du ${format(start)} au ${format(end)}`);
  };

  return (
    <div className="flex">
      <Suspense fallback={null}>
        <SideBar />
      </Suspense>
      <div className="p-6 ml-20">
      <h1 className="mb-1">Emploi du temps</h1>

      {showCalendar ? (
        <Suspense fallback={null}>
          <EmploiDuTemps
            ref={calendarRef}
            events={mockEvents}
            onDatesSet={handleDatesSet}
          />
        </Suspense>
      ) : null}
      </div>
    </div>
  );
};

export default PlanningPage;
