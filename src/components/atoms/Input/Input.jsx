import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ type, placeholder, className, icon }) => {
    return (
        <div className="relative flex items-center">
            {icon && (
                <img
                    src={icon}
                    alt="icon"
                    className="absolute left-5 h-7 w-7"
                />
            )}
            <input
                type={type}
                placeholder={placeholder}
                className={`ml-7 py-2 border-b-2 border-primary-500 text-primary-500 font-poppins text-subtitle focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 ${className}`}
            />
        </div>
    );
};

// Validation des props
Input.propTypes = {
    type: PropTypes.string.isRequired, // Type est obligatoire
    placeholder: PropTypes.string, // Placeholder est une string facultative
    className: PropTypes.string, // className est une string facultative
    icon: PropTypes.string, // Icon est une string facultative (URL de l'icône)
};

// Valeurs par défaut pour les props optionnelles
Input.defaultProps = {
    placeholder: '', // Placeholder vide par défaut
    className: '', // Aucune classe CSS par défaut
    icon: null, // Pas d'icône par défaut
};

export default Input;