import axios from "axios";
import { accountService } from "./account.service";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  const token = accountService.getToken?.();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn("Session expirée");
    }
    return Promise.reject(err);
  }
);
