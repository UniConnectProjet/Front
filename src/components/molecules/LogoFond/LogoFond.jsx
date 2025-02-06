import React from 'react';
import { Image } from '../../atoms';
import logoIcon from '../../../assets/svg/uni-with.svg';

const LogoFond = () => {
    return (
        <div className="h-screen w-96 bg-gradient-to-b from-primary-500 to-white flex justify-center items-center">
            <Image 
            src={logoIcon}
            className="absolute h-96 w-96" />
        </div>
    );
}

export default LogoFond;