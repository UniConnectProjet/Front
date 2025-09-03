import React from 'react';

const DashboardCard = ({ 
    title, 
    description, 
    icon: Icon, 
    onClick, 
    color = "bg-blue-500", 
    hoverColor = "hover:bg-blue-600",
    className = "" 
}) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg ${className}`}
        >
            <div className={`w-12 h-12 ${color} ${hoverColor} rounded-lg flex items-center justify-center mb-4 transition-colors`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
            </h3>
            <p className="text-gray-600 text-sm">
                {description}
            </p>
        </div>
    );
};

export default DashboardCard;
