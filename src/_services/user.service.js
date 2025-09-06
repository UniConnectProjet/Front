import api from './api';

class UserService {
  constructor() {
    this.baseURL = '';
  }

  // Récupérer tous les professeurs
  async getProfessors() {
    try {
      console.log('UserService - Appel API /test/professors');
      // Utiliser l'endpoint de test temporairement (en attendant l'auth)
      const response = await api.get(`${this.baseURL}/test/professors`);
      console.log('UserService - Réponse API:', response.data);
      const data = response.data;
      
      // Gérer la nouvelle structure de réponse
      if (data.success && data.professors) {
        console.log('UserService - Professeurs récupérés avec succès:', data.professors.length);
        return data.professors;
      } else {
        console.error('UserService - API Error:', data.error);
        return [];
      }
    } catch (error) {
      console.error('UserService - Error fetching professors:', error);
      // Retourner un tableau vide en cas d'erreur (401, 403, 404, etc.)
      return [];
    }
  }

  // Récupérer tous les étudiants
  async getStudents() {
    try {
      // Utiliser l'endpoint de test temporairement (en attendant l'auth)
      const response = await api.get(`${this.baseURL}/test/students`);
      const data = response.data;
      
      // Gérer la nouvelle structure de réponse
      if (data.success && data.students) {
        return data.students;
      } else {
        console.error('API Error:', data.error);
        return [];
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      // Retourner un tableau vide en cas d'erreur (401, 403, 404, etc.)
      return [];
    }
  }

  // Récupérer un utilisateur par ID
  async getUserById(id) {
    try {
      const response = await api.get(`${this.baseURL}/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Rechercher des utilisateurs
  async searchUsers(query, role = null) {
    try {
      const params = { q: query };
      if (role) {
        params.role = role;
      }
      
      const response = await api.get(`${this.baseURL}/users/search`, { params });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
}

export default new UserService();
