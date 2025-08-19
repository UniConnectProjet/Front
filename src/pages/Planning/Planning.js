import React, { Suspense, useEffect, useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../_services/api";
import { EmploiDuTemps, SideBar } from "../../components/organisms";
import { getMyStudentId } from "../../_services/student.service";

export default function Planning() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dateLabel, setDateLabel] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const id = "requestIdleCallback" in window
      ? window.requestIdleCallback(() => setShowCalendar(true))
      : setTimeout(() => setShowCalendar(true), 0);
    return () => ("cancelIdleCallback" in window ? window.cancelIdleCallback(id) : clearTimeout(id));
  }, []);

  const handleDatesSet = useCallback(async ({ start, end }) => {
    if (!start || !end) return;

    const fmt = (d) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
    setDateLabel(`Semaine du ${fmt(start)} au ${fmt(new Date(end.getTime() - 86400000))}`);

    try {
      setLoading(true); setError("");
      const studentId = await getMyStudentId();
      if (!studentId) throw new Error("No student id");

      const { data } = await api.get(`/students/${studentId}/schedule`, {
        params: { from: start.toISOString(), to: end.toISOString() },
      });
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 404) { setEvents([]); setError(""); }
      else if (status === 401) { setError("Session expirée. Reconnecte-toi."); navigate("/"); }
      else { setError("Impossible de charger l'emploi du temps."); }
    } finally { setLoading(false); }
  }, [navigate]);

  return (
    <div className="flex">
      <div className={`fixed md:static z-50 h-screen transition-transform duration-300 bg-white
                       ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 w-20`}>
        <Suspense fallback={null}><SideBar /></Suspense>
      </div>

      <div className="flex flex-col w-full">
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow z-30">
          <button onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={28} /> : <Menu size={28} />}</button>
        </div>

        <div className="p-4 md:p-6 w-full overflow-x-auto">
          <h1 className="hidden md:block text-2xl font-bold text-primary-500 mb-1">Emploi du temps</h1>
          {dateLabel && <div className="hidden md:block text-gray-600 mb-4">{dateLabel}</div>}
          {error && <div className="text-red-600 mb-2">{error}</div>}
          {loading && <div className="text-gray-500 mb-2">Chargement…</div>}
          <div className="overflow-x-auto">
            {showCalendar ? <Suspense fallback={null}><EmploiDuTemps events={events} onDatesSet={handleDatesSet} /></Suspense> : null}
          </div>
        </div>
      </div>
    </div>
  );
}