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
    return conversation.participants?.find(p => p.id !== currentUserId) || conversation.participants?.[0] || {};
  };

  const getLastMessage = () => {
    return conversation.lastMessage || conversation.messages?.[conversation.messages.length - 1];
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
  const isLastMessageFromOther = lastMessage?.sender?.id !== currentUserId;
  const hasUnreadMessages = lastMessage && isLastMessageFromOther && !lastMessage.isRead;

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
            {conversation.title || fullDisplayName}
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
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-500 rounded-full">
                1
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
