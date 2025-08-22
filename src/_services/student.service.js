import { api } from "./api";

let cachedStudentId = null;

function ensureJson(r) {
  const ct = String(r.headers?.["content-type"] || r.headers?.get?.("content-type") || "").toLowerCase();
  if (!ct.includes("json")) {
    const sample = typeof r.data === "string" ? r.data.slice(0, 200) : "";
    const err = new Error("Réponse non-JSON reçue de l’API (probablement HTML).");
    err.response = r;
    err.sample = sample;
    throw err;
  }
}

export async function getMyStudentId() {
  if (cachedStudentId) return cachedStudentId;

  const r = await api.get("/me/student", {
    headers: { Accept: "application/json" },
    validateStatus: (s) => (s >= 200 && s < 300) || s === 404,
  });

  if (r.status === 404) return null;
  ensureJson(r);

  cachedStudentId = String(r.data?.id ?? "");
  return cachedStudentId;
}

export async function getAbsenceBlocks() {
  const r = await api.get("/me/semesters/absences", {
    headers: { Accept: "application/json" },
  });
  ensureJson(r);

  const data = r.data;
  return Array.isArray(data) ? data : data ? [data] : [];
}