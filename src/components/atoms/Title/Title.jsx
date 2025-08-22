import React from 'react';
import PropTypes from 'prop-types';

const Title = ({ 
  text = '', 
  children = null, 
  className = 'text-title',
  ...props 
}) => {
  return (
    <h1 className={className} {...props}>
      {text || children}
    </h1>
  );
};

// Validation des props
Title.propTypes = {
  text: PropTypes.string, // text est une chaîne optionnelle
  children: PropTypes.node, // children peut être n'importe quel élément React
  className: PropTypes.string, // permet de personnaliser les classes
};

export default Title;