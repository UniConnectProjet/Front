import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../atoms';

const QuickActions = ({ actions, className = "" }) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
            {actions.map((action, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {action.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {action.description}
                    </p>
                    <Button
                        onClick={action.onClick}
                        className={action.buttonClassName}
                    >
                        {action.buttonText}
                    </Button>
                </div>
            ))}
        </div>
    );
};

QuickActions.propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        buttonText: PropTypes.string.isRequired,
        buttonClassName: PropTypes.string
    })).isRequired,
    className: PropTypes.string
};

export default QuickActions;
