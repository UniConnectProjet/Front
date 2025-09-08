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
  
  // Mapper les données pour correspondre au format attendu par les composants
  return data.map(session => ({
    id: session.id,
    course: session.courseTitle, // courseTitle -> course
    classe: session.classLabel,  // classLabel -> classe
    startAt: session.startAt,
    endAt: session.endAt,
    room: session.room,
    hasRoll: session.hasRoll || false, // Indique si la présence a été validée
    professor: session.professor ? {
      id: session.professor.id,
      name: session.professor.name,
      lastname: session.professor.lastname,
      fullName: `${session.professor.name || ''} ${session.professor.lastname || ''}`.trim()
    } : null
  }));
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
 * Récupère les absences enregistrées pour une séance
 * GET /api/prof/sessions/{id}/roll
 */
export async function getSessionRoll(sessionId) {
  const { data } = await api.get(`/prof/sessions/${sessionId}/roll`);
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
 * Récupère l'ID du professeur connecté
 * GET /api/professors/me
 */
export async function getMyProfessorId() {
  const professor = await getMyProfessor();
  return professor?.id || null;
}

/**
 * Récupère les catégories de notes
 * GET /api/categories
 */
export async function getCategories() {
  const { data } = await api.get("/categories");
  return data;
}

/**
 * Récupère toutes les classes
 * GET /api/classes
 */
export async function getClasses() {
  const { data } = await api.get("/classes");
  return data;
}

/**
 * Récupère les cours du professeur connecté
 * GET /api/prof/courses
 */
export async function getMyCourses() {
  const { data } = await api.get("/prof/courses");
  return data;
}

/**
 * Récupère les classes du professeur connecté
 * GET /api/prof/classes
 */
export async function getMyClasses() {
  const { data } = await api.get("/prof/classes");
  return data;
}

/**
 * Récupère les étudiants d'une classe
 * GET /api/classes/{classId}
 */
export async function getStudentsByClass(classId) {
  const { data } = await api.get(`/prof/classes/${classId}/students`);
  return data;
}

/**
 * Enregistre les notes pour une classe et un cours
 * POST /api/grade/save
 */
export async function saveGrades(classId, courseId, assignments, grades) {
  const { data } = await api.post('/grade/save', {
    classId,
    courseId,
    assignments,
    grades
  });
  return data;
}

/**
 * Récupère les notes d'un étudiant
 * GET /api/test/student/{studentId}/grades
 */
export async function getStudentGrades(studentId) {
  const { data } = await api.get(`/grade/student/${studentId}`);
  return data;
}

/**
 * Récupère la vue synthèse des notes du professeur
 * GET /api/prof/grades/overview
 */
export async function getProfessorGradesOverview(from = null, to = null) {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  
  const { data } = await api.get("/prof/grades/overview", { params });
  return data;
}

/**
 * Récupère les notes détaillées pour un cours et une classe
 * GET /api/prof/courses/{courseId}/classes/{classId}/grades
 */
export async function getCourseClassGrades(courseId, classId, from = null, to = null) {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  
  const { data } = await api.get(`/prof/courses/${courseId}/classes/${classId}/grades`, { params });
  return data;
}

/**
 * Récupère l'historique des saisies du professeur
 * GET /api/prof/grades/history
 */
export async function getProfessorGradesHistory(from = null, to = null) {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  
  const { data } = await api.get("/prof/grades/history", { params });
  return data;
}

/**
 * Crée une nouvelle note
 * POST /api/grade/student/{studentId}
 */
export async function createGrade(gradeData) {
  const { data } = await api.post(`/grade/student/${gradeData.studentId}`, gradeData);
  return data;
}

/**
 * Met à jour une note existante
 * PUT /api/grade/{studentId}
 */
export async function updateGrade(gradeId, gradeData) {
  const { data } = await api.put(`/grade/${gradeData.studentId}`, gradeData);
  return data;
}

/**
 * Sauvegarde les devoirs et notes pour une classe
 * POST /api/grade/save
 */
export async function saveAssignmentsAndGrades(classId, courseId, assignments, grades) {
  const { data } = await api.post('/grade/save', {
    classId,
    courseId,
    assignments,
    grades
  });
  return data;
}