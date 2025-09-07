import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, StatusIndicator } from '../../atoms';

const ConversationItem = ({ 
  conversation, 
  isActive = false, 
  onClick,
  currentUserId,
  className = '' 
}) => {
  const getOtherParticipant = () => {
    // Trouver le participant qui n'est pas l'utilisateur actuel
    if (!conversation.participants || conversation.participants.length === 0) {
      return {};
    }
    
    // Si on a un currentUserId, chercher l'autre participant
    if (currentUserId !== undefined && currentUserId !== null) {
      const otherParticipant = conversation.participants.find(p => 
        p.id !== currentUserId && 
        p.id !== currentUserId && 
        String(p.id) !== String(currentUserId)
      );
      
      if (otherParticipant) {
        return otherParticipant;
      }
    }
    
    // Si pas de currentUserId ou pas trouvé, essayer de deviner qui est l'autre participant
    // En général, dans une conversation élève-professeur, on peut supposer que l'élève est le premier
    // et le professeur le second, ou vice versa selon la structure des données
    
    // Si on a exactement 2 participants, essayer de deviner lequel est l'autre
    if (conversation.participants.length === 2) {
      // Si on peut identifier l'utilisateur actuel par d'autres moyens (comme le nom)
      // ou si on sait que l'utilisateur actuel est toujours le premier, prendre le second
      // Pour l'instant, on prend le second participant comme fallback
      return conversation.participants[1] || conversation.participants[0] || {};
    }
    
    // Fallback: prendre le premier participant
    return conversation.participants[0] || {};
  };

  const getLastMessage = () => {
    return conversation.lastMessage || conversation.messages?.[conversation.messages.length - 1];
  };

  const getUnreadCount = () => {
    // Utiliser le compteur de messages non lus fourni par le backend
    if (conversation.unreadCount !== undefined) {
      return conversation.unreadCount;
    }
    
    // Fallback : compter les messages non lus si les messages sont disponibles
    if (conversation.messages && Array.isArray(conversation.messages)) {
      return conversation.messages.filter(message => 
        message.sender?.id !== currentUserId && !message.isRead
      ).length;
    }
    
    // Fallback : utiliser le lastMessage pour déterminer s'il y a des messages non lus
    if (conversation.lastMessage) {
      const lastMessage = conversation.lastMessage;
      const isLastMessageFromOther = lastMessage.sender?.id !== currentUserId;
      const isLastMessageUnread = !lastMessage.isRead;
      
      if (isLastMessageFromOther && isLastMessageUnread) {
        return 1; // Au moins 1 message non lu
      }
    }
    
    return 0;
  };

  const formatLastMessageTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 jours
      return date.toLocaleDateString('fr-FR', { 
        weekday: 'short' 
      });
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const truncateMessage = (message, maxLength = 50) => {
    if (!message) return '';
    return message.length > maxLength 
      ? message.substring(0, maxLength) + '...' 
      : message;
  };

  const otherParticipant = getOtherParticipant();
  const lastMessage = getLastMessage();
  const displayName = otherParticipant.firstName || otherParticipant.name || 'Utilisateur';
  const displayLastName = otherParticipant.lastName || otherParticipant.lastname || '';
  const fullDisplayName = `${displayName} ${displayLastName}`.trim();
  const unreadCount = getUnreadCount();
  const hasUnreadMessages = unreadCount > 0;

  return (
    <div
      className={`
        flex items-center p-4 cursor-pointer transition-colors duration-200
        hover:bg-gray-50 border-b border-gray-100
        ${isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
        ${className}
      `}
      onClick={() => onClick?.(conversation)}
    >
      <div className="relative flex-shrink-0 mr-3">
        <Avatar
          src={otherParticipant.avatar}
          alt={fullDisplayName}
          size="md"
          fallback={displayName?.charAt(0) || '?'}
        />
        <StatusIndicator
          status="online" // En réalité, il faudrait gérer le statut en temps réel
          size="sm"
          className="absolute -bottom-1 -right-1 border-2 border-white"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`text-sm font-medium truncate ${hasUnreadMessages ? 'text-gray-900 font-semibold' : 'text-gray-900'}`}>
            {fullDisplayName}
          </h3>
          {lastMessage && (
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatLastMessageTime(lastMessage.createdAt)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <p className={`text-sm truncate ${hasUnreadMessages ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
            {lastMessage ? truncateMessage(lastMessage.content) : 'Aucun message'}
          </p>
          {hasUnreadMessages && (
            <div className="flex-shrink-0 ml-2">
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs font-medium text-white bg-blue-500 rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ConversationItem.propTypes = {
  conversation: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    participants: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      firstName: PropTypes.string,
      lastname: PropTypes.string,
      lastName: PropTypes.string,
      avatar: PropTypes.string
    })),
    lastMessage: PropTypes.shape({
      content: PropTypes.string,
      createdAt: PropTypes.string,
      sender: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      }),
      isRead: PropTypes.bool
    }),
    messages: PropTypes.array,
    unreadCount: PropTypes.number
  }).isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string
};

export default ConversationItem;
