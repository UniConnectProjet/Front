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

// Variable pour stocker la fonction de déconnexion
let logoutCallback = null;

// Fonction pour enregistrer le callback de déconnexion
export function setLogoutCallback(callback) {
  logoutCallback = callback;
}

// Intercepteur de réponse: gérer les erreurs d'authentification
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
  async (error) => {
    const { response } = error;
    
    // Gérer les erreurs d'authentification (401/419 = token expiré/invalide)
    if (response?.status === 401 || response?.status === 419) {
      // Éviter les boucles infinies sur les endpoints de connexion
      const isLoginEndpoint = error.config?.url?.includes('/login_check');
      
      if (!isLoginEndpoint && logoutCallback) {
        logoutCallback();
      }
    }
    
    return Promise.reject(error);
  }
);
export default api;