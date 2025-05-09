import React from "react";
import PropTypes from "prop-types";

const Text = ({ children, className = '', ...props }) => {
    return (
        <span className={`text-sm text-gray-800 ${className}`} {...props}>
            {children}
        </span>
    );
}   

Text.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Text;