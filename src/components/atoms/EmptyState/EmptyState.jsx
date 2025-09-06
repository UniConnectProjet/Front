import React from 'react';
import PropTypes from 'prop-types';

const EmptyState = ({ 
    icon, 
    title, 
    description, 
    action, 
    className = "" 
}) => {
    const renderIcon = () => {
        if (!icon) return null;
        
        // Si c'est un composant (fonction), l'appeler
        if (typeof icon === 'function') {
            const IconComponent = icon;
            return <IconComponent className="w-16 h-16 text-gray-400 mx-auto mb-4" />;
        }
        
        // Si c'est un élément JSX, le rendre directement
        return <div className="w-16 h-16 text-gray-400 mx-auto mb-4">{icon}</div>;
    };

    return (
        <div className={`bg-white rounded-lg shadow-sm border p-8 text-center ${className}`}>
            {renderIcon()}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {title}
            </h3>
            <p className="text-gray-600 mb-4">
                {description}
            </p>
            {action && action}
        </div>
    );
};

EmptyState.propTypes = {
    icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    action: PropTypes.node,
    className: PropTypes.string
};

export default EmptyState;
