import React from 'react';
import PropTypes from 'prop-types';

const StatusIndicator = ({ 
  status = 'offline', 
  size = 'sm',
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const statusClasses = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-gray-400'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.sm;
  const statusClass = statusClasses[status] || statusClasses.offline;

  return (
    <div 
      className={`${sizeClass} ${statusClass} rounded-full ${className}`}
      title={`Status: ${status}`}
    />
  );
};

StatusIndicator.propTypes = {
  status: PropTypes.oneOf(['online', 'away', 'busy', 'offline']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  className: PropTypes.string
};

export default StatusIndicator;
