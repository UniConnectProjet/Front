import React from 'react';
import PropTypes from 'prop-types';

const Title = ({ text, children, ...props }) => {
  return (
    <h1 className='text-title' {...props}>
      {text || children}
    </h1>
  );
};

// Validation des props
Title.propTypes = {
  text: PropTypes.string, // text est une chaîne optionnelle
  children: PropTypes.node, // children peut être n'importe quel élément React
};

// Valeurs par défaut
Title.defaultProps = {
  text: '', // Par défaut, texte vide
  children: null, // Pas de contenu par défaut
};

export default Title;