import React from 'react';
import PropTypes from 'prop-types';

const EmptyState = ({ 
    icon: Icon, 
    title, 
    description, 
    action, 
    className = "" 
}) => {
    return (
        <div className={`bg-white rounded-lg shadow-sm border p-8 text-center ${className}`}>
            {Icon && <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
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
    icon: PropTypes.elementType,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    action: PropTypes.node,
    className: PropTypes.string
};

export default EmptyState;
