import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Title } from '../../atoms';
import userIcon from '../../../assets/svg/user.svg';
import passwordIcon from '../../../assets/svg/password.svg';

const Form = ({ className }) => {
    return (
        <div className={`h-screen w-2/3 bg-background flex flex-col justify-center items-center ${className}`}>
            <Title className="text-primary-500">Se Connecter</Title>
            <Input type="text" icon={userIcon} placeholder="Email" className="px-7 py-2 border-b-2 border-primary-500 text-primary-500 font-poppins text-subtitle focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"/>
            <Input type="password" icon={passwordIcon} placeholder="Mot de passe" className="px-7 py-2 border-b-2 border-primary-500 text-primary-500 font-poppins text-subtitle focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50" />
            <Button className="px-5 py-1 bg-primary-500 text-white font-poppins text-subtitle rounded-full hover:bg-primary-600 transition duration-300">Se connecter</Button>
        </div>
    );
};

// Validation des props
Form.propTypes = {
    className: PropTypes.string, // Permet d'ajouter des styles supplémentaires
};

// Valeurs par défaut
Form.defaultProps = {
    className: '', // Pas de classe par défaut
};

export default Form;