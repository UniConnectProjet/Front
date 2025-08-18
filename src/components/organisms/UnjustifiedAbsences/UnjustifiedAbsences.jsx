import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Title } from "../../atoms";
import { accountService } from "../../../_services/account.service";

const BASE_URL = "http://localhost:8000/api";

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
      setAbsences(absencesProp);
      setLoading(false);
      setError(null);
      return;
    }

    let ignore = false;

    const token =
      accountService.getToken?.() ||
      (typeof localStorage !== "undefined" ? localStorage.getItem("token") : null);

    const resolveStudentId = async () => {
      const cached = studentIdProp ?? accountService.getStudentId?.();
      if (cached) return cached;
      try {
        const r = await axios.get(`${BASE_URL}/me/student`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const id = r?.data?.id ?? null;
        if (id) accountService.saveStudentId?.(id);
        return id;
      } catch {
        return null;
      }
    };

    (async () => {
      if (!token) { setError("Session absente ou expirée."); setLoading(false); return; }

      setLoading(true);
      setError(null);

      const sid = await resolveStudentId();
      if (!sid) { setError("Aucun étudiant identifié."); setLoading(false); return; }

      try {
        const res = await axios.get(`${BASE_URL}/student/${sid}/absences`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const raw = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
        const list = Array.isArray(raw?.absences) ? raw.absences : [];

        // on garde uniquement les injustifiées
        const unjustified = list
          .filter(a => a?.justified === false || String(a?.status ?? "").toLowerCase().includes("unjust"))
          .map(a => ({
            from: a?.startedDate ?? a?.start ?? a?.date ?? null,
            to:   a?.endedDate   ?? a?.end   ?? null,
          }));

        if (!ignore) setAbsences(unjustified);
      } catch (e) {
        if (!ignore) setError("Impossible de charger les absences.");
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