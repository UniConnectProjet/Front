import React from "react";
import PropTypes from "prop-types";
import { Form, LogoFond } from "../../molecules";

const Authentification = ({ className = '' }) => {
  return (
    <div className={`flex flex-row h-screen w-screen ${className}`}>
      <LogoFond />
      <Form />
    </div>
  );
};

// Validation des props
Authentification.propTypes = {
  className: PropTypes.string,
};

export default Authentification;