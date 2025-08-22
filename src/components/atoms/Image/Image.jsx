import React from "react";
import PropTypes from "prop-types";

const Image = ({ alt = "", ...props }) => {
    return <img alt={alt} {...props} />;
};

Image.propTypes = {
    alt: PropTypes.string, // Validation pour ESLint
};

export default Image;