import React, { Suspense, useEffect, useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../_services/api";
import { EmploiDuTemps, SideBar } from "../../components/organisms";
import { useAuth } from "../../auth/AuthProvider";

export default function Planning() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dateLabel, setDateLabel] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

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
      const params = {
        from: start.toISOString().split('T')[0], // YYYY-MM-DD format
        to: end.toISOString().split('T')[0],     // YYYY-MM-DD format
      };
      let data;
      
      // Utiliser le bon endpoint selon le rôle de l'utilisateur
      if (user?.roles?.includes('ROLE_PROFESSOR')) {
        // Pour les professeurs, utiliser l'endpoint professeur
        ({ data } = await api.get("/prof/sessions", { params }));
      } else if (user?.roles?.includes('ROLE_STUDENT')) {
        // Pour les étudiants, utiliser l'endpoint étudiant
        try {
          ({ data } = await api.get("/me/schedule", { params }));
        } catch (e1) {
          const status = e1?.response?.status;
          if (status === 404 || status === 405 || status === 500 || status === 501) {
            const me = await api.get("/me/student");
            const sid = me?.data?.id;
            if (!sid) throw e1;
            ({ data } = await api.get(`/students/${sid}/schedule`, { params }));
          } else {
            throw e1;
          }
        }
      } else {
        throw new Error("Rôle utilisateur non reconnu");
      }
      const map = (arr) => (Array.isArray(arr) ? arr : []).map((e, i) => {
        const ep = e.extendedProps || {};
        
        // Pour l'endpoint professeur, les données ont un format différent
        const isProfessorFormat = e.courseTitle && e.classLabel;
        
        const professorRaw = isProfessorFormat 
          ? (e.professor?.fullName || e.professor?.name || e.professor?.lastname || null) // Afficher le nom du professeur
          : (ep.professor?.fullName || ep.professor?.name || ep.professor?.lastname || null) ?? // Format étudiant avec extendedProps
            e.professor?.name ??
            ep.professor?.name ??
            (typeof e.professor === "string" ? e.professor : null) ??
            (typeof ep.professor === "string" ? ep.professor : null) ??
            e.teacher ?? e.intervenant ?? e.instructor ?? null;

        const locationRaw = isProfessorFormat
          ? e.room
          : e.location ??
            ep.location?.name ??
            ep.location ??
            e.room ?? e.salle ?? null;

        return {
          id: String(e.id ?? i),
          title: isProfessorFormat 
            ? e.courseTitle 
            : e.title ?? e.name ?? e.courseName ?? e.course ?? "Cours",
          start: e.start ?? e.startAt ?? e.startedAt ?? e.begin ?? e.dateStart ?? e.date_start,
          end:   e.end   ?? e.endAt   ?? e.endedAt   ?? e.finish ?? e.dateEnd   ?? e.date_end,
          extendedProps: {
            ...ep,                                        
            professor: professorRaw ? String(professorRaw) : null,
            location:  locationRaw  ? String(locationRaw)  : null,
            classe: isProfessorFormat ? e.classLabel : null,
            raw: e,
          },
        };
      });

      setEvents(map(data));
      } catch (e) {
      const status = e?.response?.status;
      if (status === 404) { setEvents([]); setError(""); }
      else if (status === 401) { setError("Session expirée. Reconnecte-toi."); navigate("/"); }
      else { setError("Impossible de charger l'emploi du temps."); }
    } finally { setLoading(false); }
  }, [navigate, user?.roles]);

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