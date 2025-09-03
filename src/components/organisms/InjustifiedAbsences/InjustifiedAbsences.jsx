import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Title, Select } from "../../atoms";
import { AbsenceJustification, Absence } from "../../molecules";
import AbsenceJustifyModal from "../../organisms/AbsenceJustifyModal/AbsenceJustifyModal";
import { getAbsenceBlocks } from "../../../_services/student.service";
import { getMyUnjustifiedAbsences } from "../../../_services/absence";

const minutesBetween = (startISO, endISO) => {
  if (!startISO || !endISO) return 0;
  const start = new Date(startISO);
  const end = new Date(endISO);
  return Math.max(0, Math.floor((end - start) / 60000));
};
const hhmm = (min) => `${Math.floor(min / 60)}h${String(min % 60).padStart(2, "0")}`;
const durationHHMM = (s, e) => `${hhmm(minutesBetween(s, e))} de cours manquées`;

const dateLabelFR = (startISO, endISO) => {
  if (!startISO || !endISO) return "";
  const s = new Date(startISO);
  const e = new Date(endISO);
  const day = s.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const sh = s.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const eh = e.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const dayCap = day.charAt(0).toUpperCase() + day.slice(1);
  return `${dayCap} de ${sh} à ${eh}`;
};

/** Normalise le statut : 'UNJUSTIFIED' | 'PENDING' | 'JUSTIFIED' */
const normalizeStatus = (a) => {
  const s = a?.status;

  // Si le statut est déjà normalisé par le backend (cas de buildAbsenceBlocks)
  if (typeof s === "string") {
    const up = s.trim().toUpperCase();
    if (up === "PENDING") return "PENDING";
    if (up === "UNJUSTIFIED") return "UNJUSTIFIED";
    if (up === "JUSTIFIED") return "JUSTIFIED";
  }

  // Vérifier les propriétés booléennes directes (cas de getMyUnjustifiedAbsences)
  if ((a?.isPending ?? a?.justificationPending) === true) return "PENDING";
  if ((a?.justified ?? a?.isJustified) === true) return "JUSTIFIED";

  // number direct (ancien format)
  if (typeof s === "number") {
    if (s === 4) return "PENDING";
    if (s === 3) return "UNJUSTIFIED";
    if (s === 1) return "JUSTIFIED";
  }

  // string avec valeurs numériques (ancien format)
  if (typeof s === "string" && s) {
    const up = s.trim().toUpperCase();
    if (up === "4") return "PENDING";
    if (up === "3") return "UNJUSTIFIED";
    if (up === "1") return "JUSTIFIED";
  }
  
  // Par défaut, considérer comme injustifiée
  return "UNJUSTIFIED";
};

const InjustifiedAbsences = () => {
  const [data, setData] = useState([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // vue active : 'ALL' | 'UNJUSTIFIED'
  const [view, setView] = useState("UNJUSTIFIED");

  // liste UNJUSTIFIED venant de l'API dédiée
  const [unjustified, setUnjustified] = useState([]);
  const [loadingUnj, setLoadingUnj] = useState(false);
  const [errUnj, setErrUnj] = useState(null);

  // modale
  const [modalOpen, setModalOpen] = useState(false);
  const [activeAbsence, setActiveAbsence] = useState(null);

  // ----- fetch total blocks (toutes les absences + totaux)
  const fetchBlocks = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const blocks = await getAbsenceBlocks();
      setData(Array.isArray(blocks) ? blocks : []);
    } catch (e) {
      console.error("[InjustifiedAbsences] getAbsenceBlocks error:", e);
      setErr("Impossible de charger les absences.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBlocks(); }, [fetchBlocks]);

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
        label: b?.semester?.name ?? (b?.semester?.id ? `Semestre ${b.semester.id}` : "Semestre"),
      })),
    [data]
  );

  const selectedBlock = useMemo(
    () => data.find((b) => String(b?.semester?.id ?? "") === String(selectedSemesterId)),
    [data, selectedSemesterId]
  );

  const allAbsences = useMemo(() => selectedBlock?.absences ?? [], [selectedBlock]);

  // ----- fetch UNJUSTIFIED (API dédiée) dès que le semestre change
  const fetchUnjustified = useCallback(async () => {
    if (!selectedSemesterId) return;
    setLoadingUnj(true);
    setErrUnj(null);
    try {
      const res = await getMyUnjustifiedAbsences({ semesterId: selectedSemesterId });
      const rows = Array.isArray(res?.data) ? res.data : [];
      setUnjustified(rows);
    } catch (e) {
      console.error("[InjustifiedAbsences] getMyUnjustifiedAbsences error:", e);
      setErrUnj("Impossible de charger les absences injustifiées.");
      setUnjustified([]);
    } finally {
      setLoadingUnj(false);
    }
  }, [selectedSemesterId]);

  useEffect(() => { fetchUnjustified(); }, [fetchUnjustified]);

  // Compteur/HH:MM injustifiées (à partir de la route dédiée)
  const unjustifiedDerived = useMemo(() => {
    const minutes = unjustified.reduce(
      (sum, a) => sum + minutesBetween(a.startedDate, a.endedDate),
      0
    );
    return { count: unjustified.length, hhmm: hhmm(minutes) };
  }, [unjustified]);

  // Liste affichée selon la vue
  const visibleAbsences = useMemo(
    () => (view === "ALL" ? allAbsences : unjustified),
    [view, allAbsences, unjustified]
  );

  const totalHHMM =
    selectedBlock?.totals?.hhmm ??
    hhmm(allAbsences.reduce((acc, a) => acc + minutesBetween(a.startedDate, a.endedDate), 0));

  // Ouvrir la modale
  const openJustify = (a) => {
    setActiveAbsence({
      id: a.id,
      dateLabel: dateLabelFR(a.startedDate, a.endedDate),
      missedHours: durationHHMM(a.startedDate, a.endedDate),
    });
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col px-4 md:px-8 lg:ml-20 w-full max-w-screen-lg mx-auto">
      <Title>Absences</Title>

      <Select
        className="mb-4 w-full sm:w-1/2 md:w-1/3"
        options={options.length ? options : [{ value: "", label: "Aucun semestre" }]}
        onChange={(val) => setSelectedSemesterId(val)}
        value={selectedSemesterId ?? ""}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {/* Liste */}
        <div className="flex flex-col p-2 bg-gray-100 rounded-lg shadow-md max-w-full overflow-hidden lg:col-span-2">
          {loading || (view !== "ALL" && loadingUnj) ? (
            <p className="text-gray-500 text-sm">Chargement…</p>
          ) : err || (view !== "ALL" && errUnj) ? (
            <p className="text-red-600 text-sm">{err || errUnj}</p>
          ) : !selectedBlock ? (
            <p className="text-gray-500 text-sm">Aucun semestre sélectionné</p>
          ) : visibleAbsences.length === 0 ? (
            <p className="text-gray-500 text-sm">
              {view === "ALL" ? "Aucune absence" : "Aucune absence injustifiée"}
            </p>
          ) : (
            visibleAbsences.map((a) => {
              const status = normalizeStatus(a); // UNJUSTIFIED | PENDING | JUSTIFIED
              const title =
                status === "UNJUSTIFIED" ? "Justifier" :
                status === "PENDING"     ? "En cours"  :
                                          "Justifiée";
              const onClick = status === "UNJUSTIFIED" ? () => openJustify(a) : () => {};
              const isDisabled = status !== "UNJUSTIFIED";
              
              // Debug détaillé
              console.log(`=== ABSENCE ${a.id} ===`);
              console.log('Données complètes:', a);
              console.log('Status brut:', a.status);
              console.log('Justified brut:', a.justified);
              console.log('Status normalisé:', status);
              console.log('Titre du bouton:', title);
              console.log('Est désactivé:', isDisabled);
              console.log('========================');
              
              return (
                <AbsenceJustification
                  key={a.id}
                  justification={onClick}
                  title={title}
                  date={dateLabelFR(a.startedDate, a.endedDate)}
                  hours={durationHHMM(a.startedDate, a.endedDate)}
                  disabled={isDisabled}
                />
              );
            })
          )}
        </div>

        {/* Récap cliquable */}
        <div className="flex flex-col p-2 bg-gray-100 rounded-lg shadow-md max-h-fit mt-4 lg:mt-0 lg:col-span-1">
          <Title className="text-xl font-bold text-primary-500">Récapitulatif</Title>
          <div className="flex flex-col justify-between p-2">
            <Absence
              className={`w-full ${view === "ALL" ? "ring-2 ring-primary-400 rounded-lg" : ""}`}
              title="Total des heures manquées"
              date={totalHHMM}
              onClick={() => setView("ALL")}
            />
            <Absence
              className={`w-full ${view === "UNJUSTIFIED" ? "ring-2 ring-primary-400 rounded-lg" : ""}`}
              title="Absence injustifiée"
              date={`${unjustifiedDerived.hhmm}${unjustifiedDerived.count ? ` (${unjustifiedDerived.count})` : ""}`}
              onClick={() => setView("UNJUSTIFIED")}
            />
          </div>
        </div>
      </div>

      {/* Modale */}
      <AbsenceJustifyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        absence={activeAbsence}
        onSuccess={() => { fetchBlocks(); fetchUnjustified(); }} // rafraîchir les 2 sources
      />
    </div>
  );
};

export default InjustifiedAbsences;