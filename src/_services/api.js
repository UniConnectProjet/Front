/* eslint-env browser, node */
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "https://preprod.uni-connect.cloud/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

let isRefreshing = false;
let waiters = [];

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const status = error?.response?.status;
    const cfg = error?.config || {};
    const hadSession = localStorage.getItem("had_session") === "1";

    if (status === 401 && hadSession && !cfg._retry) {
      cfg._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          waiters.push({ resolve, reject, cfg });
        });
      }

      isRefreshing = true;
      try {
        await api.post("/token/refresh", {});
        waiters.forEach(({ resolve, cfg: c }) => resolve(api(c)));
        waiters = [];
        return api(cfg);
      } catch (e) {
        localStorage.removeItem("had_session");
        waiters.forEach(({ reject }) => reject(e));
        waiters = [];
        throw e;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  }
);