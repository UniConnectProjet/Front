import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Title } from "../../atoms";
import { accountService } from "../../../_services/account.service";

const BASE_URL = "http://localhost:8000/api";

const EventRow = ({ title, start, end, professor, location }) => (
  <div className="flex flex-col p-2 bg-white rounded-md shadow-sm mb-2">
    <span className="font-semibold">{title}</span>
    <span className="text-sm text-gray-600">
      {new Date(start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – {new Date(end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </span>
    <span className="text-sm text-gray-600">{professor} • {location}</span>
  </div>
);

const NextDayCourses = ({ events: eventsProp, studentId: studentIdProp, className = "" }) => {
  const { id: idFromRoute } = useParams();
  const token = accountService.getToken?.() || (typeof localStorage !== "undefined" ? localStorage.getItem("token") : null);
  const studentId = studentIdProp ?? idFromRoute ?? accountService.getUserIdFromToken?.() ?? null;

  const [events, setEvents] = useState(Array.isArray(eventsProp) ? eventsProp : []);
  const [loading, setLoading] = useState(!Array.isArray(eventsProp));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (Array.isArray(eventsProp)) { setEvents(eventsProp); setLoading(false); setError(null); return; }

    let ignore = false;
    if (!studentId) { setError("Aucun étudiant identifié."); setLoading(false); return; }
    if (!token) { setError("Session absente ou expirée."); setLoading(false); return; }

    (async () => {
      setLoading(true); setError(null);
      try {
        const res = await axios.get(`${BASE_URL}/students/${studentId}/schedule/next-day`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const arr = Array.isArray(res?.data) ? res.data : [];
        if (!ignore) setEvents(arr);
      } catch (e) {
        if (!ignore) setError("Impossible de charger les cours du lendemain.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; };
  }, [eventsProp, studentId, token]);

  if (loading) {
    return <div className={`flex flex-col p-4 bg-gray-100 rounded-lg shadow-md ${className}`}>
      <Title className="text-buttonColor-500 text-lg">Cours de demain :</Title>
      <div className="animate-pulse h-20 bg-gray-200 rounded-md mt-2" />
    </div>;
  }

  if (error) {
    return <div className={`flex flex-col p-4 bg-gray-100 rounded-lg shadow-md ${className}`}>
      <Title className="text-buttonColor-500 text-lg">Cours de demain :</Title>
      <p className="text-red-600 text-sm">{error}</p>
    </div>;
  }

  return (
    <div className={`flex flex-col p-4 bg-gray-100 rounded-lg shadow-md ${className}`}>
      <Title className="text-buttonColor-500 text-lg">Cours de demain :</Title>
      {(events ?? []).map((e, i) => (
        <EventRow
          key={i}
          title={e.title}
          start={e.start}
          end={e.end}
          professor={e.extendedProps?.professor}
          location={e.extendedProps?.location}
        />
      ))}
      {events.length === 0 && <p className="text-gray-500">Aucun cours prévu.</p>}
    </div>
  );
};

NextDayCourses.propTypes = {
  events: PropTypes.array,
  studentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
};

export default NextDayCourses;