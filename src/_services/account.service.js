// src/_services/account.service.js

// ---- localStorage helpers
const isLocalStorageAvailable = () => {
  try {
    localStorage.setItem("_test", "_test");
    localStorage.removeItem("_test");
    return true;
  } catch {
    return false;
  }
};

const saveToken = (token) => {
  if (isLocalStorageAvailable()) localStorage.setItem("token", token);
};

const saveRefreshToken = (refreshToken) => {
  if (isLocalStorageAvailable()) localStorage.setItem("refreshToken", refreshToken);
};

const saveUserId = (id) => {
  if (isLocalStorageAvailable()) localStorage.setItem("userId", String(id));
};

// 👉 nouveaux helpers studentId
const saveStudentId = (id) => {
  if (isLocalStorageAvailable()) localStorage.setItem("studentId", String(id));
};
const getStudentId = () => {
  return isLocalStorageAvailable() ? localStorage.getItem("studentId") : null;
};

const logout = () => {
  if (!isLocalStorageAvailable()) return;
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("studentId"); // <-- important
};

const getToken = () =>
  isLocalStorageAvailable() ? localStorage.getItem("token") || null : null;

const getUserId = () =>
  isLocalStorageAvailable() ? localStorage.getItem("userId") : null;

// ---- JWT decode (base64url + padding)
const b64urlToB64 = (s) => {
  let t = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = t.length % 4 ? 4 - (t.length % 4) : 0;
  if (pad) t += "=".repeat(pad);
  return t;
};

const getTokenPayload = () => {
  const t = getToken();
  if (!t) return null;
  const parts = t.split(".");
  if (parts.length < 2) return null;
  try {
    const json = atob(b64urlToB64(parts[1]));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const isTokenExpired = () => {
  const p = getTokenPayload();
  if (!p?.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return now >= p.exp;
};

const isLogged = () => {
  const t = getToken();
  return !!t && !isTokenExpired();
};

// ---- user id from JWT
const getUserIdFromToken = () => {
  const p = getTokenPayload();
  if (!p) return null;
  return p.id ?? p.userId ?? p.uid ?? p.user?.id ?? p.sub ?? null;
};

// Ne renvoie un id que si c’est bien numérique (évite email dans sub)
const getUserIdFromTokenSafe = () => {
  const maybe = getUserIdFromToken();
  return /^\d+$/.test(String(maybe)) ? String(maybe) : null;
};

// ---- export
export const accountService = {
  saveToken,
  saveRefreshToken,
  saveUserId,
  saveStudentId,     // <-- exporté
  getStudentId,      // <-- exporté
  logout,
  isLogged,
  getToken,
  getUserId,
  getTokenPayload,
  getUserIdFromToken,
  getUserIdFromTokenSafe,
};

export default accountService;