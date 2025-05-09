import React from 'react';
import PropTypes from 'prop-types';

const Average = ({ score, titleAverage, total, className = ''}) => {
    return (
        <div className={className}>
            <div class="items-center bg-primary-400 rounded-xl px-1 py-1 mr-1"></div>
            <span className="text-sm font-bold text-gray-800">{titleAverage}</span>
            <span className="text-sm font-bold text-gray-800 bg-primary-400 rounded-lg">{score}/{total}</span>
        </div>
    );
};

Average.propTypes = {
    score: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
};

export default Average;