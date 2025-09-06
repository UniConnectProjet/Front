import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ModalShell from '../ModalShell';
import { UserSelector } from '../../molecules';

const NewConversationModal = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  onCreateConversation,
  className = "" 
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleUserSelect = async (selectedUsers) => {
    try {
      setIsCreating(true);
      
      // Créer la conversation avec les utilisateurs sélectionnés
      const participantIds = selectedUsers.map(user => user.id);
      const conversation = await onCreateConversation(participantIds);
      
      if (conversation) {
        onClose();
      }
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getModalTitle = () => {
    if (!currentUser?.roles) return 'Nouvelle conversation';
    
    if (currentUser.roles.includes('ROLE_STUDENT')) {
      return 'Sélectionner un professeur';
    } else if (currentUser.roles.includes('ROLE_PROFESSOR')) {
      return 'Sélectionner un étudiant';
    }
    
    return 'Sélectionner un utilisateur';
  };

  const getModalDescription = () => {
    if (!currentUser?.roles) return 'Choisissez avec qui vous voulez converser.';
    
    if (currentUser.roles.includes('ROLE_STUDENT')) {
      return 'Choisissez le professeur avec qui vous voulez converser.';
    } else if (currentUser.roles.includes('ROLE_PROFESSOR')) {
      return 'Choisissez l\'étudiant avec qui vous voulez converser.';
    }
    
    return 'Choisissez avec qui vous voulez converser.';
  };

  return (
    <ModalShell
      open={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      size="lg"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          {getModalDescription()}
        </p>
        
        {isCreating ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Création de la conversation...</p>
            </div>
          </div>
        ) : (
          <UserSelector
            currentUser={currentUser}
            onUserSelect={handleUserSelect}
            onCancel={onClose}
          />
        )}
      </div>
    </ModalShell>
  );
};

NewConversationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    roles: PropTypes.arrayOf(PropTypes.string)
  }),
  onCreateConversation: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default NewConversationModal;
