import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ 
    children, 
    className = '', 
    onClick = () => {},
    type = 'button'
}) => {
    return (
        <div className="relative mt-5 flex align-center justify-center">
            <button type={type} className={className} onClick={onClick}>
                {children}
            </button>
        </div>
    );
};

// Validation des props uniquement
Button.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
};

export default Button;