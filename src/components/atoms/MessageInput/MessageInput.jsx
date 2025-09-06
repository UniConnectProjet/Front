import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const MessageInput = ({ 
  onSend, 
  placeholder = 'Type something...',
  disabled = false,
  maxLength = 2000,
  className = '',
  showSendButton = true,
  allowMultiline = true
}) => {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
      
      // Auto-resize textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  };

  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => setIsComposing(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className={`flex items-end space-x-2 ${className}`}>
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={1}
          className={`
            w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${allowMultiline ? 'min-h-[44px] max-h-32' : 'h-11'}
          `}
        />
        
        {maxLength && (
          <div className="absolute bottom-1 right-2 text-xs text-gray-400">
            {message.length}/{maxLength}
          </div>
        )}
      </div>
      
      {showSendButton && (
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={`
            p-3 rounded-lg transition-colors duration-200
            ${message.trim() && !disabled
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
            />
          </svg>
        </button>
      )}
    </form>
  );
};

MessageInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  className: PropTypes.string,
  showSendButton: PropTypes.bool,
  allowMultiline: PropTypes.bool
};

export default MessageInput;
