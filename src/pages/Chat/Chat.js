import React, { useState, useEffect, useCallback } from 'react';
import { ChatLayout } from '../../components/organisms';
import { LoadingSpinner } from '../../components/atoms';
import { useAuth } from '../../auth/AuthProvider';
import { useToast } from '../../components/molecules/ToastProvider/ToastProvider';
import chatService from '../../_services/chat.service';
import mercureService from '../../_services/mercure.service';

const Chat = () => {
  const { user } = useAuth();
  const { push: showToast } = useToast();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const currentUserId = user?.id; // Utiliser l'ID de l'utilisateur connecté

  // Initialisation
  useEffect(() => {
    initializeChat();
    loadConversationsFromStorage();
    
    // Établir la connexion Mercure globale
    if (user?.id) {
      setupGlobalMercureConnection();
      
      // Polling de secours pour les conversations (toutes les 5 secondes)
      const conversationPolling = setInterval(() => {
        loadConversations();
      }, 5000);
      
      return () => {
        clearInterval(conversationPolling);
        mercureService.disconnect();
      };
    }
    
    return () => {
      mercureService.disconnect();
    };
  }, [user?.id]);

  // Sauvegarder les conversations dans localStorage
  const saveConversationsToStorage = (conversations) => {
    try {
      localStorage.setItem('chat_conversations', JSON.stringify(conversations));
      console.log('✅ Conversations sauvegardées:', conversations.length, 'conversations');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde des conversations:', error);
    }
  };

  // Charger les conversations depuis localStorage
  const loadConversationsFromStorage = () => {
    try {
      const saved = localStorage.getItem('chat_conversations');
      if (saved) {
        const conversations = JSON.parse(saved);
        
        // Mettre à jour les titres des conversations existantes
        const updatedConversations = conversations.map(conversation => {
          if (!conversation.title || conversation.title === 'Nouvelle conversation') {
            const otherParticipant = conversation.participants?.find(p => p.id !== currentUserId);
            if (otherParticipant) {
              conversation.title = `${otherParticipant.firstName} ${otherParticipant.lastName}`;
            }
          }
          return conversation;
        });
        
        setConversations(updatedConversations);
        saveConversationsToStorage(updatedConversations); // Sauvegarder les titres mis à jour
        console.log('✅ Conversations chargées depuis le stockage:', updatedConversations.length);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    }
  };

  // Connexion Mercure quand une conversation est sélectionnée
  useEffect(() => {
    if (activeConversation) {
      setupMercureConnection();
    }
  }, [activeConversation]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      
      // Vérifier que l'utilisateur est connecté
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Initialiser Mercure
      await mercureService.initialize();

      // Charger les conversations
      await loadConversations();
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      console.log('Conversations chargées:', data);
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const setupGlobalMercureConnection = () => {
    if (!user?.id) return;

    const topics = [
      `user/${user.id}/notifications`
    ];

    mercureService.connect(topics);

    // Écouter les notifications
    mercureService.onNotification(user.id, (notification) => {
      console.log('New notification:', notification);
      
      // Afficher une notification toast
      if (notification.type === 'message') {
        const senderName = notification.data?.senderName || 'Quelqu\'un';
        const messageContent = notification.content || 'Nouveau message';
        
        // Ne pas afficher de toast si la conversation est active
        if (!activeConversation || activeConversation.id !== notification.data?.conversationId) {
          showToast({
            text: `${senderName}: ${messageContent}`,
            type: 'info',
            duration: 5000
          });
        }
        
        // Rafraîchir les conversations pour mettre à jour le dernier message
        loadConversations();
        
        // Si c'est la conversation active, recharger les messages
        if (activeConversation && activeConversation.id === notification.data?.conversationId) {
          loadMessages(activeConversation.id, 1);
        }
      }
    });
  };

  const setupMercureConnection = () => {
    if (!activeConversation) return;

    const topics = [
      `conversation/${activeConversation.id}`,
      `user/${user.id}/notifications`
    ];

    mercureService.connect(topics);

    // Écouter les nouveaux messages
    mercureService.onNewMessage(activeConversation.id, (message) => {
      console.log('Nouveau message reçu:', message);
      setMessages(prev => [...prev, message]);
      
      // Mettre à jour la conversation dans la liste
      setConversations(prev => 
        prev.map(conv => 
          conv.id === activeConversation.id 
            ? { ...conv, lastMessage: message, updatedAt: new Date().toISOString() }
            : conv
        )
      );
    });

    // Écouter les mises à jour de conversation
    mercureService.onConversationUpdate(activeConversation.id, (conversation) => {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversation.id ? { ...conv, ...conversation } : conv
        )
      );
    });
  };

  const handleConversationSelect = async (conversation) => {
    try {
      // Générer le titre basé sur l'interlocuteur si ce n'est pas déjà fait
      if (!conversation.title || conversation.title === 'Nouvelle conversation') {
        const otherParticipant = conversation.participants?.find(p => p.id !== currentUserId);
        if (otherParticipant) {
          conversation.title = `${otherParticipant.firstName} ${otherParticipant.lastName}`;
        }
      }
      
      setActiveConversation(conversation);
      setMessages([]);
      setCurrentPage(1);
      
      // Charger les messages de la conversation
      await loadMessages(conversation.id, 1);
      
      // Marquer les messages comme lus
      await markMessagesAsRead(conversation.id);
      
      // Configurer la connexion Mercure pour cette conversation
      setupMercureConnection();
      
    } catch (error) {
      console.error('Error selecting conversation:', error);
    }
  };

  // Polling pour les messages de la conversation active
  useEffect(() => {
    if (!activeConversation) return;

    const messagePolling = setInterval(async () => {
      try {
        await loadMessages(activeConversation.id, 1);
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    }, 3000); // Polling toutes les 3 secondes

    return () => {
      clearInterval(messagePolling);
    };
  }, [activeConversation?.id]);

  // Marquer les messages comme lus quand l'utilisateur fait défiler vers le bas
  useEffect(() => {
    if (!activeConversation || messages.length === 0) return;

    // Délai pour marquer les messages comme lus (2 secondes après l'ouverture)
    const markAsReadTimer = setTimeout(() => {
      markMessagesAsRead(activeConversation.id);
    }, 2000);

    return () => {
      clearTimeout(markAsReadTimer);
    };
  }, [activeConversation?.id, messages.length]);

  const loadMessages = async (conversationId, page = 1) => {
    try {
      const messages = await chatService.getMessages(conversationId, page, 50);
      const loadedMessages = messages || [];
      
      // Les messages du backend sont triés par createdAt DESC (plus récents en premier)
      // On les inverse pour les afficher dans l'ordre chronologique (plus anciens en premier)
      const sortedMessages = loadedMessages.reverse();
      
      setMessages(sortedMessages);
      setHasMoreMessages(loadedMessages.length === 50); // Si on a 50 messages, il y en a peut-être plus
      
      console.log('Messages chargés:', sortedMessages.length, 'messages');
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const markMessagesAsRead = async (conversationId) => {
    try {
      await chatService.markMessagesAsRead(conversationId);
      // Rafraîchir les conversations pour mettre à jour les indicateurs de lecture
      await loadConversations();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleLoadMoreMessages = async () => {
    if (!activeConversation || !hasMoreMessages) return;

    try {
      const nextPage = currentPage + 1;
      const messages = await chatService.getMessages(activeConversation.id, nextPage, 50);
      const loadedMessages = messages || [];
      
      // Les messages du backend sont triés par createdAt DESC (plus récents en premier)
      // On les inverse pour les afficher dans l'ordre chronologique
      const sortedMessages = loadedMessages.reverse();
      
      // Ajouter les anciens messages au début de la liste
      setMessages(prev => [...sortedMessages, ...prev]);
      setCurrentPage(nextPage);
      setHasMoreMessages(loadedMessages.length === 50);
      
      console.log('Messages supplémentaires chargés:', sortedMessages.length, 'messages');
    } catch (error) {
      console.error('Error loading more messages:', error);
    }
  };

  const handleRefreshMessages = async () => {
    if (!activeConversation) return;
    
    try {
      console.log('Rafraîchissement des messages...');
      await loadMessages(activeConversation.id, 1);
      console.log('Messages rafraîchis');
    } catch (error) {
      console.error('Error refreshing messages:', error);
    }
  };

  const handleSendMessage = async (content) => {
    if (!activeConversation || !content.trim()) return;

    try {
      console.log('Chat - Envoi de message:', { content, conversationId: activeConversation.id });
      setIsSending(true);
      const message = await chatService.sendMessage(activeConversation.id, content);
      console.log('Chat - Message reçu:', message);
      
      // Ajouter le message à la liste
      setMessages(prev => {
        const newMessages = [...prev, message];
        console.log('Chat - Message ajouté:', newMessages.length);
        return newMessages;
      });

      // Mettre à jour la conversation dans la liste
      setConversations(prev => {
        const updated = prev.map(conv => 
          conv.id === activeConversation.id 
            ? { ...conv, lastMessage: message, updatedAt: new Date().toISOString() }
            : conv
        );
        saveConversationsToStorage(updated);
        return updated;
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleNewConversation = async (participantIds) => {
    try {
      console.log('Creating new conversation with participants:', participantIds);
      
      if (!participantIds || participantIds.length === 0) {
        throw new Error('Aucun participant sélectionné');
      }

      // Créer la conversation via l'API
      const conversation = await chatService.createConversation(participantIds);
      console.log('Conversation créée avec succès:', conversation);
      
      // Générer le titre basé sur l'interlocuteur
      const otherParticipant = conversation.participants?.find(p => p.id !== currentUserId);
      if (otherParticipant) {
        conversation.title = `${otherParticipant.firstName} ${otherParticipant.lastName}`;
      }
      
      // Ajouter la conversation à la liste
      setConversations(prev => {
        const newConversations = [conversation, ...prev];
        saveConversationsToStorage(newConversations);
        return newConversations;
      });
      
      // Sélectionner automatiquement la nouvelle conversation
      setActiveConversation(conversation);
      
      // Initialiser avec une liste de messages vide (pas de messages par défaut)
      setMessages([]);
      setCurrentPage(1);
      setHasMoreMessages(false);
      
      console.log('Conversation ouverte avec', conversation.messages?.length || 0, 'messages');
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
      // Ici vous pourriez afficher une notification d'erreur
    }
  };

  const handleSearchConversations = (query) => {
    setSearchQuery(query);
    // La recherche est gérée côté client dans ConversationsList
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Non connecté</h2>
          <p className="text-gray-600">Veuillez vous connecter pour accéder au chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ChatLayout
        conversations={conversations}
        activeConversation={activeConversation}
        messages={messages}
        currentUserId={currentUserId}
        currentUser={user}
        onConversationSelect={handleConversationSelect}
        onNewConversation={handleNewConversation}
        onSendMessage={handleSendMessage}
        onLoadMoreMessages={handleLoadMoreMessages}
        onRefreshMessages={handleRefreshMessages}
        onSearchConversations={handleSearchConversations}
        className="h-full"
      />
    </div>
  );
};

export default Chat;
