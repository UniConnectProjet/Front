import React from 'react';
import PropTypes from 'prop-types';

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  fallback = '?', 
  className = '',
  onClick 
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const baseClasses = 'rounded-full flex items-center justify-center bg-gray-200 text-gray-600 font-medium';
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div 
      className={`${baseClasses} ${sizeClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <span 
        className={`${src ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}
      >
        {fallback}
      </span>
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fallback: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default Avatar;
