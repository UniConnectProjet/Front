import React from 'react';
import { Image } from '../../atoms';
import logoIcon from '../../../assets/svg/uni-with.svg';

const LogoFond = () => {
    return (
        <div className="w-full md:w-1/3 h-64 md:h-screen bg-gradient-to-b from-primary-500 to-white flex justify-center items-center relative">
            <Image 
                src={logoIcon}
                className="h-48 w-48 md:h-96 md:w-96"
            />
        </div>
    );
};

export default LogoFond;