import React from "react";
import PropTypes from "prop-types";

const Select = ({ options, onChange, className = "" }) => {
    return (
        <select
            className={`border border-primary-500 bg-white rounded p-2 text-primary-500 ${className}`}
            onChange={(e) => onChange(e.target.value)}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

Select.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default Select;