import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ConversationItem } from '../../molecules';
import { EmptyState, LoadingSpinner } from '../../atoms';
import { Button, Input } from '../../atoms';
import NewConversationModal from '../NewConversationModal';

const ConversationsList = ({ 
  conversations = [],
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  isLoading = false,
  searchQuery = '',
  onSearchChange,
  currentUser,
  className = ''
}) => {
  const [filteredConversations, setFilteredConversations] = useState(conversations);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(conversation => {
        const title = conversation.title || '';
        const participantNames = conversation.participants
          ?.map(p => `${p.name} ${p.lastname}`)
          .join(' ') || '';
        
        return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               participantNames.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredConversations(filtered);
    }
  }, [conversations, searchQuery]);

  const handleConversationClick = (conversation) => {
    onConversationSelect?.(conversation);
  };

  const handleNewConversation = () => {
    setIsModalOpen(true);
  };

  const handleCreateConversation = async (participantIds) => {
    try {
      if (onNewConversation) {
        await onNewConversation(participantIds);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
      throw error;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
            <Button
              onClick={handleNewConversation}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouveau
            </Button>
          </div>
          <Input
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
          <Button
            onClick={handleNewConversation}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau
          </Button>
        </div>
        
        <Input
          type="text"
          placeholder="Rechercher une conversation..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <EmptyState
            title="Aucune conversation"
            description={searchQuery ? "Aucune conversation trouvée" : "Commencez une nouvelle conversation"}
            icon={
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            action={
              !searchQuery && (
                <Button onClick={handleNewConversation} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Nouvelle conversation
                </Button>
              )
            }
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onClick={handleConversationClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      <NewConversationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentUser={currentUser}
        onCreateConversation={handleCreateConversation}
      />
    </div>
  );
};

ConversationsList.propTypes = {
  conversations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    participants: PropTypes.array,
    lastMessage: PropTypes.object,
    unreadCount: PropTypes.number
  })),
  activeConversationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onConversationSelect: PropTypes.func,
  onNewConversation: PropTypes.func,
  isLoading: PropTypes.bool,
  searchQuery: PropTypes.string,
  onSearchChange: PropTypes.func,
  currentUser: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    roles: PropTypes.arrayOf(PropTypes.string)
  }),
  className: PropTypes.string
};

export default ConversationsList;
