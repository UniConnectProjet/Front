import { api } from "./api";

/**
 * POST /api/absences/{id}/justify
 * - envoie FormData (reason, comment?, files[], _token?)
 * - supporte onUploadProgress (Axios)
 */
export async function justifyAbsence(
    absenceId,
    { reason, comment, files, csrfToken },
    onUploadProgress
) {
    const form = new FormData();
    form.append("reason", reason);
    if (comment) form.append("comment", comment);

    (files || []).forEach((f) => form.append("attachments[]", f));
    if (csrfToken) form.append("_token", csrfToken);

    const url = `/absences/${absenceId}/justify`;
    const res = await api.post(url, form, {
        onUploadProgress: (evt) => {
            if (!onUploadProgress || !evt.total) return;
            onUploadProgress(Math.round((evt.loaded / evt.total) * 100));
        },
    });

    return res.data; // JSON (validation/ressource) selon ton backend
}

export async function getMyUnjustifiedAbsences({ semesterId } = {}) {
  const params = {};
  if (semesterId) params.semesterId = semesterId;
  // <- URL alignée avec le préfixe de classe
  const { data } = await api.get("/absences/me/unjustified", { params });
  return data;
}
