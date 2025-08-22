// src/_services/auth.service.js
import { api } from "./api";

let memToken = null;
const KEY = "access_token";

export function setAccessToken(token) {
  memToken = token || null;
  if (token) sessionStorage.setItem(KEY, token);
  else sessionStorage.removeItem(KEY);
}

export function getAccessToken() {
  return memToken || sessionStorage.getItem(KEY) || null;
}

export function clearAccessToken() {
  memToken = null;
  sessionStorage.removeItem(KEY);
}

export function isJwtExpired(token) {
  try {
    const [, b64] = token.split(".");
    const json = atob(b64.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json);
    return !exp || exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export async function refreshSession() {
  try {
    await api.post("/token/refresh", {});
    const me = await api.get("/me/student").catch(() => null);
    return me?.data ?? null;
  } catch {
    return null;
  }
}

