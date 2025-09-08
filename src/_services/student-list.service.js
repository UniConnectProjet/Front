import { api } from './api';

export const getStudentsList = async () => {
  try {
    const { data } = await api.get('/students/list');
    return data;
  } catch (error) {
    console.error('Error fetching students list:', error);
    throw error;
  }
};

export const getStudentsWithAbsences = async () => {
  try {
    const { data } = await api.get('/students/with-absences');
    return data;
  } catch (error) {
    console.error('Error fetching students with absences:', error);
    throw error;
  }
};

export const getStudentsByClass = async (classId) => {
  try {
    const { data } = await api.get(`/students/by-class/${classId}`);
    return data;
  } catch (error) {
    console.error('Error fetching students by class:', error);
    throw error;
  }
};
