import React from 'react';
import DashboardCard from '../../atoms/DashboardCard';

const DashboardGrid = ({ cards, className = "" }) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
            {cards.map((card, index) => (
                <DashboardCard
                    key={index}
                    title={card.title}
                    description={card.description}
                    icon={card.icon}
                    onClick={card.onClick}
                    color={card.color}
                    hoverColor={card.hoverColor}
                />
            ))}
        </div>
    );
};

export default DashboardGrid;
