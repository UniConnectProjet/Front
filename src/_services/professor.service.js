import { api } from "./api";

/**
 * Service pour les fonctionnalités professeur
 */

/**
 * Récupère les séances du professeur pour une période donnée
 * GET /api/prof/sessions?from=2025-01-15&to=2025-01-15
 */
export async function getProfessorSessions({ from, to } = {}) {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  
  const { data } = await api.get("/prof/sessions", { params });
  return data;
}

/**
 * Récupère les séances du jour pour le professeur
 */
export async function getTodaySessions() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return getProfessorSessions({ from: today, to: today });
}

/**
 * Récupère les séances de la semaine pour le professeur
 */
export async function getWeekSessions() {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lundi
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Dimanche
  
  const from = startOfWeek.toISOString().split('T')[0];
  const to = endOfWeek.toISOString().split('T')[0];
  
  return getProfessorSessions({ from, to });
}

/**
 * Récupère la liste des étudiants d'une séance
 * GET /api/prof/sessions/{id}/roster
 */
export async function getSessionRoster(sessionId) {
  const { data } = await api.get(`/prof/sessions/${sessionId}/roster`);
  return data;
}

/**
 * Enregistre l'appel (présence/absence/retard) pour une séance
 * POST /api/prof/sessions/{id}/roll
 */
export async function saveSessionRoll(sessionId, attendances) {
  const { data } = await api.post(`/prof/sessions/${sessionId}/roll`, {
    attendances
  });
  return data;
}

/**
 * Enregistre les notes pour une séance
 * POST /api/prof/sessions/{id}/grades
 */
export async function saveSessionGrades(sessionId, grades) {
  const { data } = await api.post(`/prof/sessions/${sessionId}/grades`, {
    grades
  });
  return data;
}

/**
 * Récupère les informations du professeur connecté
 * GET /api/professors/me
 */
export async function getMyProfessor() {
  const { data } = await api.get("/professors/me");
  return data;
}

/**
 * Récupère les catégories de notes
 * GET /api/categories
 */
export async function getCategories() {
  const { data } = await api.get("/categories");
  return data;
}
