/* eslint-env browser, node */
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

let isRefreshing = false;
let waiters = [];

// Toujours demander du JSON
api.defaults.headers.common["Accept"] = "application/json";
api.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Intercepteur côté succès: rejeter les réponses HTML "cachées"
api.interceptors.response.use((r) => {
  const ct = String(r.headers?.["content-type"] || "").toLowerCase();
  if (!ct.includes("json")) {
    const sample = typeof r.data === "string" ? r.data.slice(0, 200) : "";
    const err = new Error("Réponse non-JSON reçue (probable redirection vers HTML).");
    err.response = r;
    err.sample = sample;
    throw err;
  }
  return r;
}, (error) => Promise.reject(error));