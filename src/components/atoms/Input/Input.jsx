import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ 
    type, 
    placeholder = '', 
    className = '', 
    icon = null,
    value = '',
    onChange = () => {}
}) => {
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
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

// Validation des props
Input.propTypes = {
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

export default Input;