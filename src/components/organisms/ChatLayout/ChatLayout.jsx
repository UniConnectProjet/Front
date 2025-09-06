import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ConversationsList from '../ConversationsList';
import ChatWindow from '../ChatWindow';
import { LoadingSpinner, Button } from '../../atoms';

const ChatLayout = ({ 
  conversations = [],
  activeConversation,
  messages = [],
  currentUserId,
  currentUser,
  isLoading = false,
  onConversationSelect,
  onNewConversation,
  onSendMessage,
  onLoadMoreMessages,
  onSearchConversations,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showConversations, setShowConversations] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && activeConversation) {
      setShowConversations(false);
    } else {
      setShowConversations(true);
    }
  }, [isMobile, activeConversation]);

  const handleConversationSelect = (conversation) => {
    onConversationSelect?.(conversation);
    if (isMobile) {
      setShowConversations(false);
    }
  };

  const handleBackToConversations = () => {
    setShowConversations(true);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    onSearchConversations?.(query);
  };

  if (isLoading) {
    return (
      <div className={`flex h-full ${className}`}>
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-full bg-gray-50 ${className}`}>
      {/* Conversations Sidebar */}
      <div className={`
        ${isMobile ? 'w-full' : 'w-1/3 lg:w-1/4'} 
        ${showConversations ? 'flex' : 'hidden'}
        flex-col border-r border-gray-200 bg-white
      `}>
        <ConversationsList
          conversations={conversations}
          activeConversationId={activeConversation?.id}
          onConversationSelect={handleConversationSelect}
          onNewConversation={onNewConversation}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          currentUser={currentUser}
          className="h-full"
        />
      </div>

      {/* Chat Window */}
      <div className={`
        ${isMobile ? 'w-full' : 'flex-1'} 
        ${!showConversations ? 'flex' : isMobile ? 'hidden' : 'flex'}
        flex-col
      `}>
        {isMobile && !showConversations && (
          <div className="flex items-center p-4 border-b border-gray-200 bg-white">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToConversations}
              className="mr-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">
              {activeConversation?.title || 'Conversation'}
            </h2>
          </div>
        )}
        
        <ChatWindow
          conversation={activeConversation}
          messages={messages}
          currentUserId={currentUserId}
          onSendMessage={onSendMessage}
          onLoadMoreMessages={onLoadMoreMessages}
          className="flex-1"
        />
      </div>
    </div>
  );
};

ChatLayout.propTypes = {
  conversations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    participants: PropTypes.array,
    lastMessage: PropTypes.object,
    unreadCount: PropTypes.number
  })),
  activeConversation: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    participants: PropTypes.array
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
  currentUser: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    roles: PropTypes.arrayOf(PropTypes.string)
  }),
  isLoading: PropTypes.bool,
  onConversationSelect: PropTypes.func,
  onNewConversation: PropTypes.func,
  onSendMessage: PropTypes.func,
  onLoadMoreMessages: PropTypes.func,
  onSearchConversations: PropTypes.func,
  className: PropTypes.string
};

export default ChatLayout;
