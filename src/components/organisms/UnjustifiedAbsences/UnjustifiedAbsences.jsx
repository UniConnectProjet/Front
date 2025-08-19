import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Title } from "../../atoms";
import { api } from "../../../_services/api";

const toBool = (v) => (v === true || v === 1 || v === "1") ? true
  : (v === false || v === 0 || v === "0") ? false
  : null;

const Absence = ({ from, to }) => (
  <div className="flex flex-col p-2 bg-white rounded-md shadow-sm mb-2">
    <span className="font-semibold">Absence</span>
    <span className="text-sm text-gray-600">
      {from ? new Date(from).toLocaleDateString() : "—"}
      {to ? ` → ${new Date(to).toLocaleDateString()}` : ""}
    </span>
  </div>
);

const UnjustifiedAbsences = ({ absences: absencesProp, studentId: studentIdProp, className = "" }) => {
  const [absences, setAbsences] = useState(Array.isArray(absencesProp) ? absencesProp : []);
  const [loading, setLoading] = useState(!Array.isArray(absencesProp));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (Array.isArray(absencesProp)) {
      setAbsences(absencesProp); setLoading(false); setError(null);
      return;
    }

    let ignore = false;

    const resolveStudentId = async () => {
      if (studentIdProp) return String(studentIdProp);
      try {
        const r = await api.get("/me/student");           
        return r?.data?.id ? String(r.data.id) : null;
      } catch { return null; }
    };

    (async () => {
      setLoading(true);
      setError(null);

      const sid = await resolveStudentId();
      if (!sid) { if (!ignore) { setError("Aucun étudiant identifié."); setLoading(false); } return; }

      try {
        const raw = await api.get(`/students/${sid}/semesters/absences`);
        const payload = typeof raw.data === "string" ? JSON.parse(raw.data) : raw.data;
        
        const blocks = Array.isArray(payload) ? payload : (payload ? [payload] : []);
        const allAbsences = blocks.flatMap(b => Array.isArray(b?.absences) ? b.absences : []);

        // Garde uniquement les injustifiées
        const unjustified = allAbsences
          .filter(a => {
            const j = toBool(a?.justified ?? a?.isJustified);
            if (j === false) return true;
            const status = String(a?.status ?? "").toLowerCase();
            return status.includes("unjust");
          })
          .map(a => ({
            from: a?.startedDate ?? a?.start ?? a?.date ?? null,
            to:   a?.endedDate   ?? a?.end   ?? null,
          }));

        if (!ignore) setAbsences(unjustified);
      } catch (e) {
        if (!ignore) {
          if (e?.response?.status === 404) { setAbsences([]); setError(null); }
          else { setError("Impossible de charger les absences."); }
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; };
  }, [absencesProp, studentIdProp]);

  if (loading) {
    return (
      <div className={`flex flex-col p-4 bg-gray-100 rounded-lg shadow-md ${className}`}>
        <Title className="text-buttonColor-500 text-lg">Absences :</Title>
        <div className="animate-pulse h-20 bg-gray-200 rounded-md mt-2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col p-4 bg-gray-100 rounded-lg shadow-md ${className}`}>
        <Title className="text-buttonColor-500 text-lg">Absences :</Title>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col p-4 bg-gray-100 rounded-lg shadow-md ${className}`}>
      <Title className="text-buttonColor-500 text-lg">Absences :</Title>
      {(absences ?? []).map((a, i) => <Absence key={i} from={a.from} to={a.to} />)}
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