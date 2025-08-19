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
