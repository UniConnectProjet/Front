import React from 'react';

const Input = ({ type, placeholder, className, icon }) => {
    return (
        <div className="relative flex items-center">
            {icon && (
                <img
                    src={icon}
                    alt="icon"
                    className="absolute left-3 h-5 w-5"
                />
            )}
            <input
            type={type}
            placeholder={placeholder}
            className={` ${className}`}/>
        </div>
        
    );
}

export default Input;