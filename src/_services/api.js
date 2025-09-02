/* eslint-env browser, node */
import axios from "axios";

const baseURL = (() => {
  const envURL =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
    (typeof process !== "undefined" &&
      (process.env?.VITE_API_BASE_URL ||
       process.env?.REACT_APP_API_BASE_URL ||
       process.env?.NEXT_PUBLIC_API_BASE_URL));

  if (envURL) return envURL;

  const isDev =
    (typeof import.meta !== "undefined" && !!import.meta.env?.DEV) ||
    (typeof process !== "undefined" && process.env?.NODE_ENV === "development") ||
    (typeof window !== "undefined" &&
      window.location.hostname === "localhost" &&
      window.location.port === "3000");

  return isDev ? "http://localhost:8000/api" : "/api";
})();

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Toujours demander du JSON
api.defaults.headers.common["Accept"] = "application/json";
api.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Intercepteur côté succès: rejeter les réponses HTML "cachées"
api.interceptors.response.use(
  (r) => {
    const ct = String(r.headers?.["content-type"] || "").toLowerCase();
    if (!ct.includes("json")) {
      const sample = typeof r.data === "string" ? r.data.slice(0, 200) : "";
      const err = new Error("Réponse non-JSON reçue (probable redirection vers HTML).");
      err.response = r;
      err.sample = sample;
      throw err;
    }
    return r;
  },
  (error) => Promise.reject(error)
);
export default api;