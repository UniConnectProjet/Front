import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, className }) => {
    return (
        <div className="relative mt-5 flex align-center justify-center">
            <button className={className}>
                {children}
            </button>
        </div>
    );
};

// Validation des props
Button.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

// Valeurs par défaut pour les props optionnelles
Button.defaultProps = {
    className: '',
};

export default Button;