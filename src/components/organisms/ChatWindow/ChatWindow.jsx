import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MessageList, MessageComposer } from '../../molecules';
import { Avatar, Button, LoadingSpinner } from '../../atoms';

const ChatWindow = ({ 
  conversation,
  messages = [],
  currentUserId,
  onSendMessage,
  onLoadMoreMessages,
  isLoading = false,
  isSending = false,
  hasMoreMessages = false,
  className = ''
}) => {
  const [isTyping, setIsTyping] = useState(false);

  const getOtherParticipant = () => {
    if (!conversation?.participants) return {};
    return conversation.participants.find(p => p.id !== currentUserId) || conversation.participants[0] || {};
  };

  const handleSendMessage = (content) => {
    if (content.trim() && !isSending) {
      onSendMessage?.(content);
    }
  };

  const handleLoadMore = () => {
    if (hasMoreMessages && !isLoading) {
      onLoadMoreMessages?.();
    }
  };

  const handleAttachmentClick = () => {
    // TODO: Implémenter la logique d'attachement de fichiers
    console.log('Attachment clicked');
  };

  if (!conversation) {
    return (
      <div className={`flex-1 flex items-center justify-center bg-gray-50 ${className}`}>
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez une conversation</h3>
          <p className="text-sm text-gray-500">Choisissez une conversation pour commencer à discuter</p>
        </div>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant();

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <Avatar
            src={otherParticipant.avatar}
            alt={`${otherParticipant.name} ${otherParticipant.lastname}`}
            size="md"
            fallback={otherParticipant.name?.charAt(0) || '?'}
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {conversation.title || `${otherParticipant.name} ${otherParticipant.lastname}`}
            </h3>
            <p className="text-sm text-gray-500">
              {otherParticipant.name} {otherParticipant.lastname}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
            title="Informations de la conversation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
            title="Plus d'options"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        isLoading={isLoading}
        onLoadMore={handleLoadMore}
        hasMore={hasMoreMessages}
        className="flex-1"
      />

      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>{otherParticipant.name} est en train d'écrire...</span>
          </div>
        </div>
      )}

      {/* Message Composer */}
      <MessageComposer
        onSend={handleSendMessage}
        disabled={isSending}
        placeholder={isSending ? "Envoi en cours..." : "Tapez votre message..."}
        onAttachmentClick={handleAttachmentClick}
        className="border-t border-gray-200"
      />
    </div>
  );
};

ChatWindow.propTypes = {
  conversation: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    participants: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      lastname: PropTypes.string,
      avatar: PropTypes.string
    }))
  }),
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
  onSendMessage: PropTypes.func,
  onLoadMoreMessages: PropTypes.func,
  isLoading: PropTypes.bool,
  isSending: PropTypes.bool,
  hasMoreMessages: PropTypes.bool,
  className: PropTypes.string
};

export default ChatWindow;
