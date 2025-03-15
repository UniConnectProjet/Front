import React from 'react';

const Button = ({ children, className }) => {
    return (
        <div className="relative mt-5 flex align-center justify-center">
            <button className={` ${className}`}>
                {children}
            </button>
        </div>
    );
};

export default Button;
