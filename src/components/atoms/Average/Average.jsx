import React from 'react';
import PropTypes from 'prop-types';

const Average = ({ score, titleAverage, total, className = ''}) => {
    return (
        <div className={className}>
            <div className="flex items-center">
                <div className="items-center bg-primary-400 rounded-xl p-1 mr-2"></div>
                <span className="text-sm font-bold text-gray-800">{titleAverage}</span>
            </div>
            <span className="text-sm font-bold text-white bg-primary-400 rounded-lg p-1">{score}/{total}</span>
        </div>
    );
};

Average.propTypes = {
    titleAverage: PropTypes.string.isRequired,
    className: PropTypes.string,
    score: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
};

export default Average;