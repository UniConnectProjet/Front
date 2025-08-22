import React from "react";
import PropTypes from "prop-types";
import { Button } from "../../atoms";

const Filter = ({ titlePrev, titleToday, titleNext, onPrev, onNext, onToday, className = "" }) => { 
    return (
        <div className={`flex items-center p-2 ${className}`}>
            <Button onClick={onPrev} className="px-3 py-1 bg-gray-200 rounded text-primary-500">
                {titlePrev}
            </Button>
            <Button onClick={onToday} className="px-3 py-1 bg-gray-200 rounded text-primary-500">
                {titleToday}
            </Button>
            <Button onClick={onNext} className="px-3 py-1 bg-gray-200 rounded text-primary-500">
                {titleNext}
            </Button>
        </div>
    );
}

Filter.propTypes = {
    onPrev: PropTypes.func.isRequired,
    titlePrev: PropTypes.string.isRequired,
    titleNext: PropTypes.string.isRequired,
    titleToday: PropTypes.string.isRequired,
    onNext: PropTypes.func.isRequired,  
    onToday: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default Filter;