import React from 'react';
import { Grade, Average } from '../../atoms';

const GradeCard = ({ title, score, total, className = '' }) => {
    return (
        <div className={`flex flex-col w-2/3 p-2 ${className}`}>
            <Average 
                score={score} 
                titleAverage={title} 
                total={total} 
                className="flex justify-between items-center pb-2 border-b border-black" 
            />
            <Grade score={score} titleGrade={title} total={total} className="flex items-center p-4 justify-between" />
        </div>
    );
}

export default GradeCard;

