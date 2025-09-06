import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import UserCard from '../UserCard';
import { LoadingSpinner } from '../../atoms';
import userService from '../../../_services/user.service';

const UserSelector = ({ 
  currentUser, 
  onUserSelect, 
  onCancel,
  className = "" 
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('UserSelector - Début du chargement des utilisateurs');
      
      // Récupérer les utilisateurs selon le rôle de l'utilisateur actuel
      let users = [];
      const userRoles = currentUser?.roles || ['ROLE_STUDENT'];
      console.log('UserSelector - Rôles utilisateur:', userRoles);
      
      if (userRoles.includes('ROLE_STUDENT')) {
        console.log('UserSelector - Récupération des professeurs...');
        users = await userService.getProfessors();
        console.log('UserSelector - Professeurs récupérés:', users.length, users);
      } else if (userRoles.includes('ROLE_PROFESSOR')) {
        console.log('UserSelector - Récupération des étudiants...');
        users = await userService.getStudents();
        console.log('UserSelector - Étudiants récupérés:', users.length, users);
      } else {
        console.log('UserSelector - Récupération de tous les utilisateurs...');
        users = await userService.searchUsers('');
        console.log('UserSelector - Utilisateurs récupérés:', users.length, users);
      }
      
      console.log('UserSelector - Utilisateurs finaux à afficher:', users.length, users);
      setUsers(users);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      // En cas d'erreur, ne pas utiliser de données de test
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };


  const handleUserSelect = (user) => {
    const isSelected = selectedUsers.some(selected => selected.id === user.id);
    
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter(selected => selected.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleConfirm = () => {
    if (selectedUsers.length > 0) {
      onUserSelect(selectedUsers);
    }
  };

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('UserSelector - Utilisateurs filtrés:', filteredUsers);
  console.log('UserSelector - Loading:', loading);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>


      {/* Users List */}
      <div className="max-h-96 overflow-y-auto space-y-2">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur disponible'}
          </div>
        ) : (
          filteredUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              isSelected={selectedUsers.some(selected => selected.id === user.id)}
              onSelect={handleUserSelect}
            />
          ))
        )}
      </div>

      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Utilisateurs sélectionnés ({selectedUsers.length})
          </h4>
          <div className="space-y-2">
            {selectedUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                <span className="text-sm text-gray-900">
                  {user.firstName} {user.lastName}
                </span>
                <button
                  onClick={() => handleUserSelect(user)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Annuler
        </button>
        <button
          onClick={handleConfirm}
          disabled={selectedUsers.length === 0}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Créer la conversation
        </button>
      </div>
    </div>
  );
};

UserSelector.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    roles: PropTypes.arrayOf(PropTypes.string)
  }),
  onUserSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default UserSelector;
