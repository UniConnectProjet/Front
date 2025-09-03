import React from 'react';

const LoadingSpinner = ({ 
    size = "medium", 
    text = "Chargement...", 
    className = "" 
}) => {
    const sizeClasses = {
        small: "h-6 w-6",
        medium: "h-8 w-8",
        large: "h-12 w-12"
    };

    return (
        <div className={`flex items-center justify-center py-8 ${className}`}>
            <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
            {text && <span className="ml-2 text-gray-600">{text}</span>}
        </div>
    );
};

export default LoadingSpinner;
