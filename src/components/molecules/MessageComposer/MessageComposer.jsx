import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MessageInput, Button } from '../../atoms';

const MessageComposer = ({ 
  onSend, 
  disabled = false,
  placeholder = 'Type something...',
  className = '',
  showAttachments = true,
  onAttachmentClick
}) => {
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (message) => {
    onSend(message);
    setIsTyping(false);
  };

  const handleTyping = (message) => {
    setIsTyping(message.length > 0);
  };

  return (
    <div className={`bg-white border-t border-gray-200 p-4 ${className}`}>
      {showAttachments && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onAttachmentClick}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </Button>
          </div>
          
          {isTyping && (
            <div className="text-xs text-gray-500 flex items-center">
              <div className="flex space-x-1 mr-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              En train d'écrire...
            </div>
          )}
        </div>
      )}
      
      <MessageInput
        onSend={handleSend}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={2000}
        allowMultiline={true}
        showSendButton={true}
      />
    </div>
  );
};

MessageComposer.propTypes = {
  onSend: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  showAttachments: PropTypes.bool,
  onAttachmentClick: PropTypes.func
};

export default MessageComposer;
