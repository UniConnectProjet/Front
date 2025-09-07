import React from 'react';
import PropTypes from 'prop-types';
import { sanitizeText } from '../../../utils/sanitization';

const MessageBubble = ({ 
  message, 
  isOwn = false, 
  showAvatar = true, 
  showTime = true,
  showReadStatus = true,
  className = '' 
}) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const sanitizeContent = (content) => {
    return sanitizeText(content);
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${className}`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {showAvatar && !isOwn && (
          <div className="flex-shrink-0 mr-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-medium text-white shadow-md">
              {message.sender?.firstName?.charAt(0) || message.sender?.name?.charAt(0) || '?'}
            </div>
          </div>
        )}
        
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          {/* Nom de l'expéditeur pour les messages des autres */}
          {!isOwn && showAvatar && (
            <div className="text-xs text-gray-600 mb-1 px-1">
              {message.sender?.firstName || message.sender?.name || 'Utilisateur'} {message.sender?.lastName || message.sender?.lastname || ''}
            </div>
          )}
          
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm relative ${
              isOwn 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md' 
                : `bg-white text-gray-900 rounded-bl-md border border-gray-200 ${
                    !message.isRead ? 'ring-2 ring-blue-100 bg-blue-50' : ''
                  }`
            }`}
          >
            <div 
              className={`text-sm whitespace-pre-wrap break-words leading-relaxed ${
                isOwn ? 'text-white' : 'text-gray-800'
              }`}
              dangerouslySetInnerHTML={{ 
                __html: sanitizeContent(message.content) 
              }}
            />
            
            {/* Indicateur de nouveau message */}
            {!isOwn && !message.isRead && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          {showTime && (
            <div className={`text-xs mt-1 px-1 flex items-center ${isOwn ? 'text-blue-400 text-right justify-end' : 'text-gray-500 text-left justify-start'}`}>
              <span>{formatTime(message.createdAt)}</span>
              {isOwn && showReadStatus && (
                <span className="ml-1">
                  {message.isRead ? (
                    <svg className="w-3 h-3 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

MessageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    isRead: PropTypes.bool,
    sender: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      firstName: PropTypes.string,
      lastname: PropTypes.string,
      lastName: PropTypes.string
    })
  }).isRequired,
  isOwn: PropTypes.bool,
  showAvatar: PropTypes.bool,
  showTime: PropTypes.bool,
  showReadStatus: PropTypes.bool,
  className: PropTypes.string
};

export default MessageBubble;
