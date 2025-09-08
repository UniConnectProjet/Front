import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { TextArea, ProgressBar, Button, Select } from "../../atoms";
import { FormField, FileUpload } from "../../molecules";
import ModalShell from "../ModalShell/ModalShell";
import { useToast } from "../../molecules/ToastProvider/ToastProvider";
import { justifyAbsence } from "../../../_services/absence";

const ALLOWED_MIME = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function AbsenceJustifyModal({
  open,
  onClose,
  absence, // { id, dateLabel, missedHours? }
  onSuccess,
  csrfToken,
  endpoint, // optional: (absenceId) => string
}) {
  const { push } = useToast();

  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset à chaque ouverture
  useEffect(() => {
    if (!open) return;
    setReason("");
    setComment("");
    setFiles([]);
    setErrors({});
    setProgress(null);
    setSubmitting(false);
  }, [open, absence?.id]);

  const options = useMemo(
    () => [
      { value: "Maladie", label: "Maladie" },
      { value: "Rendez-vous", label: "Rendez-vous" },
      { value: "Problème de transport", label: "Problème de transport" },
      { value: "Autre", label: "Autre" },
    ],
    []
  );

  const validate = () => {
    const v = {};
    if (!reason) v.reason = "Merci de choisir un motif.";
    setErrors(v);
    return Object.keys(v).length === 0;
  };

  const handleSubmit = async () => {
    if (!absence?.id) return;
    if (!validate()) return;
    try {
      setSubmitting(true);
      setProgress(0);
      await justifyAbsence(
        absence.id,
        { reason, comment, files, csrfToken, endpoint },
        (p) => setProgress(p)
      );
      push({ type: "success", text: "Absence justifiée avec succès." });
      setProgress(100);
      onClose?.();
      onSuccess?.();
    } catch (e) {
      push({ type: "error", text: e?.message || "Une erreur est survenue." });
      setSubmitting(false);
      setProgress(null);
    }
  };

  return (
    <ModalShell open={open} onClose={onClose} title="Justifier une absence" size="md">
      <div
        className="
          sm:max-h-none
          max-h-[calc(100dvh-10rem)]   /* hauteur utile mobile */
          overflow-y-auto overscroll-contain
          pr-1 -mr-1                    /* évite le décalage à cause de la scrollbar */
        "
      >
        {/* Contexte absence */}
        {absence && (
          <div className="mb-4 text-[14px] leading-5 text-text-700">
            <div className="font-semibold text-text-900">{absence.dateLabel}</div>
            {absence.missedHours && (
              <div className="text-text-500">{absence.missedHours}</div>
            )}
          </div>
        )}

        <div className="grid gap-4">
          <FormField label="Raison" error={errors.reason} required>
            <Select
              value={reason}
              onChange={setReason}
              options={options}
              placeholder="Motif à préciser"
            />
          </FormField>

          <FormField label="Commentaire" hint="Optionnel">
            <TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ajouter un commentaire…"
            />
          </FormField>

          <FormField
            label="Ajouter un justificatif"
            hint="PDF, JPG, PNG — 5 Mo max, 3 fichiers"
            error={errors.attachments}
          >
            <FileUpload
              id="absence-files"
              files={files}
              onChange={setFiles}
              accept={ALLOWED_MIME}
              maxFiles={3}
              maxSizeMB={5}
              mode="button"
              buttonLabel="Joindre un fichier"
              onRejected={(_, reasons) =>
                setErrors((e) => ({ ...e, attachments: reasons.join(" • ") }))
              }
            />
          </FormField>

          {progress !== null && (
            <div className="grid gap-1">
              <ProgressBar value={progress} />
              <div className="text-[12px] leading-4 text-text-500">
                Téléversement… {progress}%
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={submitting}
          className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
        >
          Annuler
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
        >
          {submitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Envoi…</span>
            </div>
          ) : (
            "Valider"
          )}
        </Button>
      </div>
    </ModalShell>
  );
}

AbsenceJustifyModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  absence: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dateLabel: PropTypes.string,
    missedHours: PropTypes.string,
  }),
  onSuccess: PropTypes.func,
  csrfToken: PropTypes.string,
  endpoint: PropTypes.func,
};