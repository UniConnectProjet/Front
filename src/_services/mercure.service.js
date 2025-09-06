class MercureService {
  constructor() {
    this.hubUrl = null;
    this.eventSource = null;
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  async initialize() {
    try {
      // Récupérer l'URL du hub Mercure depuis l'API
      const response = await fetch('/api/mercure/hub-url');
      
      if (!response.ok) {
        console.warn('Mercure service not available, continuing without real-time features');
        return false;
      }
      
      const data = await response.json();
      this.hubUrl = data.hubUrl;
      
      console.log('Mercure service initialized with hub URL:', this.hubUrl);
      return true;
    } catch (error) {
      console.warn('Failed to initialize Mercure service, continuing without real-time features:', error);
      return false;
    }
  }

  connect(topics = []) {
    if (!this.hubUrl) {
      console.warn('Mercure service not initialized, skipping connection');
      return false;
    }

    if (this.eventSource) {
      this.disconnect();
    }

    try {
      const url = new URL(this.hubUrl);
      topics.forEach(topic => {
        url.searchParams.append('topic', topic);
      });

      this.eventSource = new EventSource(url.toString());
      
      this.eventSource.onopen = () => {
        console.log('Mercure connection opened');
        this.reconnectAttempts = 0;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data, event.lastEventId);
        } catch (error) {
          console.error('Error parsing Mercure message:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('Mercure connection error:', error);
        this.handleReconnect();
      };

      return true;
    } catch (error) {
      console.error('Failed to connect to Mercure:', error);
      return false;
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log('Mercure connection closed');
    }
  }

  subscribe(topic, callback) {
    this.subscriptions.set(topic, callback);
    console.log(`Subscribed to topic: ${topic}`);
  }

  unsubscribe(topic) {
    this.subscriptions.delete(topic);
    console.log(`Unsubscribed from topic: ${topic}`);
  }

  handleMessage(data, eventId) {
    console.log('Received Mercure message:', data);

    // Déterminer le topic basé sur le type de message
    let topic = null;
    
    if (data.type === 'message' && data.message?.conversationId) {
      topic = `conversation/${data.message.conversationId}`;
    } else if (data.type === 'conversation_update' && data.conversation?.id) {
      topic = `conversation/${data.conversation.id}`;
    } else if (data.type === 'notification' && data.notification?.userId) {
      topic = `user/${data.notification.userId}/notifications`;
    }

    if (topic && this.subscriptions.has(topic)) {
      const callback = this.subscriptions.get(topic);
      callback(data, eventId);
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      const topics = Array.from(this.subscriptions.keys());
      this.connect(topics);
    }, delay);
  }

  // Méthodes utilitaires pour les différents types d'événements
  onNewMessage(conversationId, callback) {
    const topic = `conversation/${conversationId}`;
    this.subscribe(topic, (data) => {
      if (data.type === 'message') {
        callback(data.message);
      }
    });
  }

  onConversationUpdate(conversationId, callback) {
    const topic = `conversation/${conversationId}`;
    this.subscribe(topic, (data) => {
      if (data.type === 'conversation_update') {
        callback(data.conversation);
      }
    });
  }

  onNotification(userId, callback) {
    const topic = `user/${userId}/notifications`;
    this.subscribe(topic, (data) => {
      if (data.type === 'notification') {
        callback(data.notification);
      }
    });
  }

  // Méthode pour tester la connexion
  isConnected() {
    return this.eventSource && this.eventSource.readyState === EventSource.OPEN;
  }

  getConnectionState() {
    if (!this.eventSource) return 'disconnected';
    
    switch (this.eventSource.readyState) {
      case EventSource.CONNECTING:
        return 'connecting';
      case EventSource.OPEN:
        return 'connected';
      case EventSource.CLOSED:
        return 'closed';
      default:
        return 'unknown';
    }
  }
}

export default new MercureService();
