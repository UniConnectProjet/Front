import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../../atoms/Avatar';
import { Button } from '../../atoms';

const UserCard = ({ 
  user, 
  isSelected = false, 
  onSelect, 
  className = "" 
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(user);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-center p-3 rounded-lg border cursor-pointer transition-all
        ${isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }
        ${className}
      `}
    >
      <Avatar 
        src={user.avatar} 
        alt={`${user.firstName} ${user.lastName}`}
        size="md"
        className="mr-3"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {user.firstName} {user.lastName}
        </h4>
        <p className="text-sm text-gray-500 truncate">
          {user.email}
        </p>
        {user.roles && (
          <div className="flex flex-wrap gap-1 mt-1">
            {user.roles.map((role, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {role === 'ROLE_PROFESSOR' ? 'Professeur' : 
                 role === 'ROLE_STUDENT' ? 'Étudiant' : 
                 role === 'ROLE_ADMIN' ? 'Admin' : role}
              </span>
            ))}
          </div>
        )}
      </div>
      {isSelected && (
        <div className="ml-2">
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  className: PropTypes.string
};

export default UserCard;
