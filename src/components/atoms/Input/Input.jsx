import React from 'react';

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
            className={`ml-7 py-2 border-b-2 border-primary-500 text-primary-500 font-poppins text-subtitle focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 ${className}`}/>
        </div>
        
    );
}

export default Input;