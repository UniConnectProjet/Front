import React, { useEffect, useRef, useState } from "react";
import { EmploiDuTemps, SideBar } from "../../components/organisms";
import { Menu, X } from "lucide-react";

// Exemple de données statiques (à remplacer plus tard par un fetch API)
const mockEvents = [
  {
    id: "1",
    title: "Full Stack",
    start: "2025-08-16T08:00:00",
    end: "2025-08-16T12:00:00",
    extendedProps: {
      professor: "Mme Perez",
      location: "Salle 023",
    },
  },
  {
    id: "2",
    title: "Full Stack",
    start: "2025-08-16T16:00:00",
    end: "2025-08-16T18:00:00",
    extendedProps: {
      professor: "Mme Perez",
      location: "Salle 023",
    },
  },
  {
    id: "3",
        title: "Full Stack",
        start: "2025-08-12T08:00:00",
        end: "2025-08-12T12:00:00",
        extendedProps: {
        professor: "Mme Perez",
        location: "Salle 023",
        },
  },
  {
    id: "4",
    title: "Full Stack",
    start: "2025-08-12T14:00:00",
    end: "2025-08-12T17:00:00",
    extendedProps: {
      professor: "Mme Perez",
      location: "Salle 023",
    },
  },
  {
    id: "5",
        title: "Full Stack",
        start: "2025-08-13T08:00:00",
        end: "2025-08-13T12:00:00",
        extendedProps: {
        professor: "Mme Perez",
        location: "Salle 023",
        },
  },
  {
    id: "6",
    title: "Full Stack",
    start: "2025-08-13T14:00:00",
    end: "2025-08-13T17:00:00",
    extendedProps: {
      professor: "Mme Perez",
      location: "Salle 023",
    },
  },
  {
    id: "7",
        title: "Full Stack",
        start: "2025-08-14T08:00:00",
        end: "2025-08-14T12:00:00",
        extendedProps: {
        professor: "Mme Perez",
        location: "Salle 023",
        },
  },
  {
    id: "8",
    title: "Full Stack",
    start: "2025-08-14T14:00:00",
    end: "2025-08-14T17:00:00",
    extendedProps: {
      professor: "Mme Perez",
      location: "Salle 023",
    },
  },

];

const PlanningPage = () => {
  const calendarRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [setDateLabel] = useState("");

  const handleDatesSet = (info) => {
    const start = new Date(info.start);
    const end = new Date(info.end);
    const format = (date) =>
      date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
      });
    setDateLabel(`Semaine du ${format(start)} au ${format(end)}`);
  };

  return (
    <div className="flex">
      {/* Sidebar responsive */}
      <div
        className={`fixed md:static z-50 h-screen transition-transform duration-300 bg-white
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 w-20`}
      >
        <SideBar />
      </div>

      {/* Overlay mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Contenu principal */}
      <div className="flex flex-col w-full">
        {/* Barre mobile */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow z-30">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <h1 className="text-primary-500 font-bold text-lg">Emploi du temps</h1>
        </div>

        <div className="p-4 md:p-6 w-full overflow-x-auto">
          <h1 className="hidden md:block text-2xl font-bold text-primary-500 mb-4">
            Emploi du temps
          </h1>

          <div className="overflow-x-auto">
            <EmploiDuTemps
              ref={calendarRef}
              events={mockEvents}
              onDatesSet={handleDatesSet}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningPage;
