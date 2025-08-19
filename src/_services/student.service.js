import { api } from "./api";

let cachedStudentId = null;

export async function getMyStudentId() {
  if (cachedStudentId) return cachedStudentId;
  try {
    const r = await api.get("/me/student");   
    cachedStudentId = String(r.data.id);
    return cachedStudentId;
  } catch (e) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
}

export async function getAbsenceBlocks() {
  const r = await api.get("/me/semesters/absences");
  const data = typeof r.data === "string" ? JSON.parse(r.data) : r.data;
  return Array.isArray(data) ? data : (data ? [data] : []);
}
