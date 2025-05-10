import React from 'react';
import PropTypes from 'prop-types';

const OverallAverage = ({ score, titleOverallAverage, total, className = ''}) => {
    return (
        <div className={className}>
            <div className="flex items-center">
                <span className="text-sm font-bold text-gray-800">{titleOverallAverage}</span>
            </div>
            <span className="text-sm font-bold p-1">{score}/{total}</span>
        </div>
    );
};

OverallAverage.propTypes = {
    titleOverallAverage: PropTypes.string.isRequired,
    className: PropTypes.string,
    score: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
};

export default OverallAverage;