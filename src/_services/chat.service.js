import api from './api';
import { validateMessageContent } from '../utils/sanitization';

class ChatService {
  constructor() {
    this.baseURL = '/conversations';
  }

  // Conversations
  async getConversations() {
    const response = await api.get(this.baseURL);
    return response.data;
  }

  async getConversation(id) {
    const response = await api.get(`${this.baseURL}/${id}`);
    return response.data;
  }

  async createConversation(participantIds, title = null) {
    // console.log('ChatService - Création de conversation avec participants:', participantIds);
    
    const response = await api.post(this.baseURL, { participantIds, title });
    // console.log('ChatService - Réponse création conversation:', response.data);
    
    return response.data;
  }

  // Messages
  async getMessages(conversationId, page = 1, limit = 50) {
    const response = await api.get(`${this.baseURL}/${conversationId}/messages`, {
      params: { page, limit }
    });
    return response.data;
  }

  async sendMessage(conversationId, content) {
    // console.log('ChatService - Envoi de message:', { conversationId, content });
    
    const validation = validateMessageContent(content);
    
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    
    const response = await api.post(`${this.baseURL}/${conversationId}/messages`, {
      content
    });
    
    // console.log('ChatService - Réponse envoi message:', response.data);
    
    return response.data;
  }

  async markMessageAsRead(conversationId, messageId) {
    const response = await api.put(`${this.baseURL}/${conversationId}/messages/${messageId}/read`);
    return response.data;
  }

  // Notifications
  async getNotifications(page = 1, limit = 20) {
    const response = await api.get('/notifications', {
      params: { page, limit }
    });
    return response.data;
  }

  async getUnreadNotifications() {
    const response = await api.get('/notifications/unread');
    return response.data;
  }

  async markNotificationAsRead(notificationId) {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  }

  async markAllNotificationsAsRead() {
    const response = await api.put('/notifications/read-all');
    return response.data;
  }

  async markMessagesAsRead(conversationId) {
    const response = await api.put(`/conversations/${conversationId}/messages/read`);
    return response.data;
  }

  async getNotificationCount() {
    const response = await api.get('/notifications/count');
    return response.data;
  }

  // Mercure
  async getMercureHubUrl() {
    const response = await api.get('/mercure/hub-url');
    return response.data.hubUrl;
  }

  async getMercureTopics() {
    const response = await api.get('/mercure/topics');
    return response.data.topics;
  }
}

const chatService = new ChatService();
export default chatService;
