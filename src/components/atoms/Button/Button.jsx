import React from 'react';

const Button = ({ children, className }) => {
    return (
        <button
            className={`px-4 py-2 text-primary-500 border border-primary-500 rounded hover:bg-primary-500 hover:text-white transition duration-300 ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
