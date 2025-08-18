import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Title } from "../../atoms";
import { api } from "../../../_services/api";
import { accountService } from "../../../_services/account.service";

const EventRow = ({ title, start, end, professor, location }) => (
  <div className="bg-blue-100 p-3 mb-2 rounded">
    <p className="font-semibold">{title}</p>
    <div className="flex flex-col text-sm text-gray-700">
      <span className="text-sm text-gray-600">
        {start ? new Date(start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}{" – "}
        {end ? new Date(end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
      </span>
      <span className="text-sm text-gray-600">
        {[professor, location].filter(Boolean).join(" • ")}
      </span>
    </div>
    
  </div>
);

const toJson = (raw) => (typeof raw === "string" ? (() => { try { return JSON.parse(raw); } catch { return null; } })() : raw);

const normalizeEvents = (raw) => {
  const data = toJson(raw);
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.events)) return data.events;
  if (Array.isArray(data.sessions)) {
    return data.sessions.map((s) => ({
      title: s?.course?.name ?? s?.title ?? "Cours",
      start: s?.startAt ?? s?.start ?? null,
      end:   s?.endAt   ?? s?.end   ?? null,
      extendedProps: {
        professor: s?.professor?.name ?? s?.professor?.lastname ?? s?.professor ?? undefined,
        location:  s?.room ?? s?.location ?? undefined,
      },
    }));
  }
  const arr = Object.values(data);
  return Array.isArray(arr) ? arr : [];
};

const NextDayCourses = ({ className = "" }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const resolveStudentId = async () => {
      const cached = accountService.getStudentId?.();
      if (cached) return cached;

      try {
        const r = await api.get("/me/student");
        const sid = r?.data?.id ?? null;
        if (sid) accountService.saveStudentId?.(sid);
        return sid;
      } catch {
        return null;
      }
    };

    (async () => {
      setLoading(true);
      setError(null);

      const studentId = await resolveStudentId();
      if (!studentId) {
        if (!ignore) { setError("Aucun étudiant identifié."); setLoading(false); }
        return;
      }

      const d0 = new Date(); d0.setHours(0,0,0,0); d0.setDate(d0.getDate() + 1);
      const d1 = new Date(d0); d1.setDate(d1.getDate() + 1);
      const fmt = (d) => d.toISOString().slice(0, 10);

      try {
        const res = await api.get(`/students/${studentId}/schedule/next-day`);
        const ev = normalizeEvents(res?.data);
        if (!ignore) { setEvents(ev); setLoading(false); }
        return;
      } catch (e1) {
        console.warn("next-day failed:", e1?.response?.status, e1?.response?.data);
      }

      try {
        const res2 = await api.get(`/students/${studentId}/schedule`, {
          params: { from: fmt(d0), to: fmt(d1) },
        });
        const ev2 = normalizeEvents(res2?.data);
        if (!ignore) { setEvents(ev2); setLoading(false); }
      } catch (e2) {
        console.warn("schedule range failed:", e2?.response?.status, e2?.response?.data);
        if (!ignore) {
          if (e2?.response?.status === 404) { setEvents([]); setLoading(false); }
          else if (e2?.response?.status === 401) { setError("Session expirée. Reconnecte-toi."); setLoading(false); }
          else { setError("Impossible de charger les cours du lendemain."); setLoading(false); }
        }
      }
    })();

    return () => { ignore = true; };
  }, []);

  if (loading) {
    return (
      <div className={`flex flex-col p-4 bg-gray-100 rounded-lg shadow-md ${className}`}>
        <Title className="text-buttonColor-500 text-lg">Prochain cours :</Title>
        <div className="animate-pulse h-20 bg-gray-200 rounded-md mt-2" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col p-4 bg-gray-100 rounded-lg shadow-md ${className}`}>
      <Title className="text-buttonColor-500 text-lg">Prochain cours :</Title>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!error && events.map((e, i) => (
        <EventRow
          key={i}
          title={e.title}
          start={e.start}
          end={e.end}
          professor={e.extendedProps?.professor}
          location={e.extendedProps?.location}
        />
      ))}

      {!error && events.length === 0 && <p className="text-gray-500">Aucun cours prévu.</p>}
    </div>
  );
};

NextDayCourses.propTypes = { className: PropTypes.string };
export default NextDayCourses;