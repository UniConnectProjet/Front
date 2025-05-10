import React from 'react';
import PropTypes from 'prop-types';

const Grade = ({ score, titleGrade, total, className = ''}) => {
    return (
        <div className={className}>
            <span className="text-sm font-bold text-gray-800">{titleGrade}</span>
            <span className="text-sm font-bold text-gray-800">{score}/{total}</span>
        </div>
    );
};

Grade.propTypes = {
    titleGrade: PropTypes.string.isRequired,
    className: PropTypes.string,
    score: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
};

export default Grade;