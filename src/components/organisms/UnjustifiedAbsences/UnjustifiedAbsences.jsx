import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Title } from "../../atoms";
import { getAbsenceBlocks } from "../../../_services/student.service";

const toBool = (v) =>
  v === true || v === 1 || v === "1"
    ? true
    : v === false || v === 0 || v === "0"
    ? false
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

Absence.propTypes = {
  from: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
};

function pickDates(a = {}) {
  const from =
    a.from ?? a.startedDate ?? a.start ?? a.startAt ?? a.startedAt ?? a.dateStart ?? a.begin;
  const to =
    a.to ?? a.endedDate ?? a.end ?? a.endAt ?? a.endedAt ?? a.dateEnd ?? a.finish;
  return { from, to };
}

export default function UnjustifiedAbsences({ absences: absencesProp, studentId, className = "" }) {
  const [absences, setAbsences] = useState(absencesProp ?? []);
  const [loading, setLoading] = useState(!absencesProp);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let ignore = false;
    if (absencesProp) return; // controlled via prop

    (async () => {
      try {
        setErr(null);
        setLoading(true);

        // Endpoint is cookie-scoped: /me/semesters/absences
        // studentId is ignored, but we keep the prop for API symmetry
        const blocks = await getAbsenceBlocks();
        if (ignore) return;
        const all = (Array.isArray(blocks) ? blocks : [])
          .flatMap((b) => Array.isArray(b?.absences) ? b.absences : [])
          .filter((a) => toBool(a?.justified ?? a?.isJustified) === false)
          .map((a) => ({ ...a, ...pickDates(a) }));
        setAbsences(all);
      }catch (e) {
          const looksHtml = typeof e?.sample === "string" && /<html|<!DOCTYPE|<br\s*\/?>/i.test(e.sample);
          if (!ignore) {
            setErr(looksHtml
              ? "Session expirée ou accès refusé — veuillez vous reconnecter."
              : "Impossible de charger les absences.");
          }
          console.error("[UnjustifiedAbsences] load error:", e);
        } finally {

        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; };
  }, [absencesProp, studentId]);

  if (loading) return <p className="text-gray-500 text-sm">Chargement…</p>;
  if (err) return <p className="text-red-600 text-sm">{err}</p>;

  return (
    <div className={`flex flex-col p-4 bg-gray-100 rounded-lg shadow-md ${className}`}>
      <Title className="text-buttonColor-500 text-lg">Absences :</Title>
      {(absences ?? []).map((a, i) => <Absence key={a.id ?? i} from={a.from} to={a.to} />)}
      {(absences?.length ?? 0) === 0 && <p className="text-gray-500">Aucune absence injustifiée.</p>}
    </div>
  );
}

UnjustifiedAbsences.propTypes = {
  absences: PropTypes.array,
  studentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
};
