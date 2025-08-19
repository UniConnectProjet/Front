// src/components/organisms/InjustifiedAbsences/InjustifiedAbsences.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Title, Select } from "../../atoms";
import { AbsenceJustification, Absence } from "../../molecules";
import PropTypes from "prop-types";
import { getAbsenceBlocks } from "../../../_services/student.service";

const durationHHMM = (startISO, endISO) => {
  if (!startISO || !endISO) return "—";
  const start = new Date(startISO);
  const end = new Date(endISO);
  const min = Math.max(0, Math.floor((end - start) / 60000));
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h${String(m).padStart(2, "0")} de cours manquées`;
};

const toBool = (v) =>
  v === true || v === 1 || v === "1"
    ? true
    : v === false || v === 0 || v === "0"
    ? false
    : null;

const InjustifiedAbsences = () => {
  const [data, setData] = useState([]); // blocks by semester
  const [selectedSemesterId, setSelectedSemesterId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // Load blocks for the *current user* (cookie auth): /me/semesters/absences
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const blocks = await getAbsenceBlocks();
        if (!mounted) return;
        setData(Array.isArray(blocks) ? blocks : []);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("[InjustifiedAbsences] API error:", e);
        if (mounted) setErr("Impossible de charger les absences.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => void (mounted = false);
  }, []);

  // Select first semester by default when data arrives
  useEffect(() => {
    if (data.length) {
      setSelectedSemesterId((prev) => prev ?? String(data[0]?.semester?.id ?? ""));
    }
  }, [data]);

  const options = useMemo(
    () =>
      data.map((b) => ({
        value: String(b?.semester?.id ?? ""),
        label:
          b?.semester?.name ??
          (b?.semester?.id ? `Semestre ${b.semester.id}` : "Semestre"),
      })),
    [data]
  );

  const selectedBlock = useMemo(
    () => data.find((b) => String(b?.semester?.id ?? "") === String(selectedSemesterId)),
    [data, selectedSemesterId]
  );

  const unjustifiedAbsences = useMemo(() => {
    const list = selectedBlock?.absences ?? [];
    return list.filter((a) => toBool(a?.justified ?? a?.isJustified) === false);
  }, [selectedBlock]);

  const totalHHMM = selectedBlock?.totals?.hhmm ?? "0h00";
  const unjustifiedHHMM = selectedBlock?.totals?.unjustified?.hhmm ?? "0h00";
  const unjustifiedCount = selectedBlock?.totals?.unjustified?.count ?? 0;

  return (
    <div className="flex flex-col px-4 md:px-8 lg:ml-20 w-full max-w-screen-lg mx-auto">
      <Title>Absences</Title>

      <Select
        className="mb-4 w-full sm:w-1/2 md:w-1/4"
        options={options.length ? options : [{ value: "", label: "Aucun semestre" }]}
        onChange={(val) => setSelectedSemesterId(val)}
        value={selectedSemesterId ?? ""}
      />

      <div className="flex flex-col lg:flex-row p-4">
        <div className="flex flex-col p-2 bg-gray-100 rounded-lg shadow-md w-full lg:w-2/3">
          {loading ? (
            <p className="text-gray-500 text-sm">Chargement…</p>
          ) : err ? (
            <p className="text-red-600 text-sm">{err}</p>
          ) : !selectedBlock ? (
            <p className="text-gray-500 text-sm">Aucun semestre sélectionné</p>
          ) : unjustifiedAbsences.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucune absence injustifiée</p>
          ) : (
            unjustifiedAbsences.map((a) => (
              <AbsenceJustification
                key={a.id}
                justification={() => {}}
                title="Justifier"
                date={`${new Date(a.startedDate).toLocaleString()} → ${new Date(
                  a.endedDate
                ).toLocaleString()}`}
                hours={durationHHMM(a.startedDate, a.endedDate)}
              />
            ))
          )}
        </div>

        <div className="flex flex-col ml-14 p-2 bg-gray-100 rounded-lg shadow-md max-h-fit">
          <Title className="text-xl font-bold text-primary-500">Récapitulatif</Title>
          <div className="flex flex-col justify-between p-2">
            <Absence title="Total des heures manquées" date={totalHHMM} />
            <Absence
              title="Absence injustifiée"
              date={`${unjustifiedHHMM}${unjustifiedCount ? ` (${unjustifiedCount})` : ""}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

InjustifiedAbsences.propTypes = {};
export default InjustifiedAbsences;
