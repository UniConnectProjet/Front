import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Title } from "../../atoms";
import { accountService } from "../../../_services/account.service";

const BASE_URL = "http://localhost:8000/api";

const Absence = ({ title, date }) => (
  <div className="flex flex-col p-2 bg-white rounded-md shadow-sm mb-2">
    <span className="font-semibold">{title}</span>
    <span className="text-sm text-gray-600">{date}</span>
  </div>
);

const UnjustifiedAbsences = ({ absences: absencesProp, studentId: studentIdProp, className = "" }) => {
  const { id: idFromRoute } = useParams();
  const token = accountService.getToken?.() || (typeof localStorage !== "undefined" ? localStorage.getItem("token") : null);
  const studentId = studentIdProp ?? idFromRoute ?? accountService.getUserIdFromToken?.() ?? null;

  const [absences, setAbsences] = useState(Array.isArray(absencesProp) ? absencesProp : []);
  const [loading, setLoading] = useState(!Array.isArray(absencesProp));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (Array.isArray(absencesProp)) { setAbsences(absencesProp); setLoading(false); setError(null); return; }

    let ignore = false;
    if (!studentId) { setError("Aucun étudiant identifié."); setLoading(false); return; }
    if (!token) { setError("Session absente ou expirée."); setLoading(false); return; }

    (async () => {
      setLoading(true); setError(null);
      try {
        const res = await axios.get(`${BASE_URL}/students/${studentId}/absences`, {
          params: { status: "unjustified" },
          headers: { Authorization: `Bearer ${token}` },
        });
        const arr = Array.isArray(res?.data) ? res.data : [];
        if (!ignore) setAbsences(arr);
      } catch (e) {
        if (!ignore) setError("Impossible de charger les absences.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; };
  }, [absencesProp, studentId, token]);

  if (loading) {
    return <div className={`flex flex-col p-4 bg-gray-100 rounded-lg shadow-md ${className}`}>
      <Title className="text-buttonColor-500 text-lg">Absences :</Title>
      <div className="animate-pulse h-20 bg-gray-200 rounded-md mt-2" />
    </div>;
  }

  if (error) {
    return <div className={`flex flex-col p-4 bg-gray-100 rounded-lg shadow-md ${className}`}>
      <Title className="text-buttonColor-500 text-lg">Absences :</Title>
      <p className="text-red-600 text-sm">{error}</p>
    </div>;
  }

  return (
    <div className={`flex flex-col p-4 bg-gray-100 rounded-lg shadow-md ${className}`}>
      <Title className="text-buttonColor-500 text-lg">Absences :</Title>
      {(absences ?? []).map((a, i) => <Absence key={i} title={a.title} date={a.date} />)}
      {absences.length === 0 && <p className="text-gray-500">Aucune absence injustifiée.</p>}
    </div>
  );
};

UnjustifiedAbsences.propTypes = {
  absences: PropTypes.array,
  studentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
};

export default UnjustifiedAbsences;