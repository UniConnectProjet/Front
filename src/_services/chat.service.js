import api from './api';
import { validateMessageContent, validateConversationData } from '../utils/sanitization';

class ChatService {
  constructor() {
    this.baseURL = '/conversations';
  }

  // Conversations
  async getConversations() {
    try {
      const response = await api.get(this.baseURL);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  async getConversation(id) {
    try {
      const response = await api.get(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }

  async createConversation(participantIds, title = null) {
    try {
      console.log('ChatService - Création de conversation avec participants:', participantIds);
      
      const response = await api.post(this.baseURL, { participantIds, title });
      console.log('ChatService - Réponse création conversation:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  // Messages
  async getMessages(conversationId, page = 1, limit = 50) {
    try {
      const response = await api.get(`${this.baseURL}/${conversationId}/messages`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async sendMessage(conversationId, content) {
    try {
      console.log('ChatService - Envoi de message:', { conversationId, content });
      
      const validation = validateMessageContent(content);
      
      if (!validation.isValid) {
        throw new Error(validation.error);
      }
      
      const response = await api.post(`${this.baseURL}/${conversationId}/messages`, {
        content
      });
      
      console.log('ChatService - Réponse envoi message:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async markMessageAsRead(conversationId, messageId) {
    try {
      const response = await api.put(`${this.baseURL}/${conversationId}/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  // Notifications
  async getNotifications(page = 1, limit = 20) {
    try {
      const response = await api.get('/notifications', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async getUnreadNotifications() {
    try {
      const response = await api.get('/notifications/unread');
      return response.data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllNotificationsAsRead() {
    try {
      const response = await api.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async getNotificationCount() {
    try {
      const response = await api.get('/notifications/count');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification count:', error);
      throw error;
    }
  }

  // Mercure
  async getMercureHubUrl() {
    try {
      const response = await api.get('/mercure/hub-url');
      return response.data.hubUrl;
    } catch (error) {
      console.error('Error fetching Mercure hub URL:', error);
      throw error;
    }
  }

  async getMercureTopics() {
    try {
      const response = await api.get('/mercure/topics');
      return response.data.topics;
    } catch (error) {
      console.error('Error fetching Mercure topics:', error);
      throw error;
    }
  }
}

export default new ChatService();
