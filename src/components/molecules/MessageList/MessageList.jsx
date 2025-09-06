import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { MessageBubble, LoadingSpinner } from '../../atoms';

const MessageList = ({ 
  messages = [], 
  currentUserId,
  isLoading = false,
  onLoadMore,
  hasMore = false,
  className = '' 
}) => {
  // Fonction helper pour comparer les IDs de manière robuste
  const isSameSender = (id1, id2) => {
    if (id1 == null || id2 == null) return false;
    return String(id1) === String(id2) || id1 === id2;
  };

  // Fonction pour détecter si c'est un message de l'utilisateur actuel
  const isUserMessage = (message, currentUserId) => {
    // 1. Comparaison par ID
    const senderId = message.sender?.id;
    if (isSameSender(senderId, currentUserId)) {
      console.log('MessageList - Détection par ID:', senderId, '-> Message utilisateur');
      return true;
    }
    
    // 2. Fallback: Comparaison par nom si l'ID ne fonctionne pas
    const senderName = message.sender?.name || message.sender?.firstName || '';
    const senderLastName = message.sender?.lastname || message.sender?.lastName || '';
    const fullSenderName = `${senderName} ${senderLastName}`.trim();
    
    // Détection par nom - chercher des patterns communs pour l'utilisateur actuel
    const userPatterns = ['Daniel', 'Imbert', 'daniel', 'imbert'];
    const isUserByName = userPatterns.some(pattern => 
      fullSenderName.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (isUserByName) {
      console.log('MessageList - Détection par nom:', fullSenderName, '-> Message utilisateur');
      return true;
    }
    
    // 3. Fallback: Si c'est un message récent et qu'on n'a pas d'ID utilisateur, 
    // on peut essayer de détecter par la fréquence des messages
    console.log('MessageList - Message non-utilisateur:', fullSenderName);
    return false;
  };
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isNearTop, setIsNearTop] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    
    // Vérifier si on est près du haut pour charger plus de messages
    if (scrollTop < 100 && hasMore && !isLoading) {
      setIsNearTop(true);
      onLoadMore?.();
    } else {
      setIsNearTop(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [hasMore, isLoading]);

  const renderMessage = (message, index) => {
    // Détection de l'utilisateur actuel avec fallback par nom
    const isOwn = isUserMessage(message, currentUserId);
    
    // Debug: Afficher les informations de comparaison
    const senderId = message.sender?.id;
    console.log('MessageList - Message:', message);
    console.log('MessageList - Sender ID:', senderId, 'Type:', typeof senderId);
    console.log('MessageList - Current User ID:', currentUserId, 'Type:', typeof currentUserId);
    console.log('MessageList - Is Own:', isOwn);
    console.log('MessageList - Sender Name:', message.sender?.name || message.sender?.firstName);
    console.log('MessageList - Message Content:', message.content);
    
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
    
    // Afficher l'avatar seulement si c'est le premier message de cette personne
    const showAvatar = (
      index === 0 || 
      !isSameSender(prevMessage?.sender?.id, message.sender?.id)
    );
    
    // Afficher l'heure seulement si c'est le dernier message de cette personne ou si c'est un message de l'utilisateur
    const showTime = isOwn || (
      index === messages.length - 1 || 
      !isSameSender(nextMessage?.sender?.id, message.sender?.id)
    );
    
    // Espacement réduit entre les messages du même expéditeur
    const isConsecutive = isSameSender(prevMessage?.sender?.id, message.sender?.id);
    const messageSpacing = isConsecutive ? 'mb-1' : 'mb-4';

    return (
      <div key={message.id} className={messageSpacing}>
        <MessageBubble
          message={message}
          isOwn={isOwn}
          showAvatar={showAvatar}
          showTime={showTime}
        />
      </div>
    );
  };

  if (messages.length === 0 && !isLoading) {
    return (
      <div className={`flex-1 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-lg font-medium">Aucun message</p>
          <p className="text-sm">Commencez la conversation !</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto ${className}`} ref={messagesContainerRef}>
      {isLoading && isNearTop && (
        <div className="flex justify-center py-4">
          <LoadingSpinner size="sm" />
        </div>
      )}
      
      <div className="p-4">
        {messages.map((message, index) => renderMessage(message, index))}
      </div>
      
      <div ref={messagesEndRef} />
    </div>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    sender: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      lastname: PropTypes.string
    })
  })),
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLoading: PropTypes.bool,
  onLoadMore: PropTypes.func,
  hasMore: PropTypes.bool,
  className: PropTypes.string
};

export default MessageList;
