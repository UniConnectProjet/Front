import React from "react";
import { Title, Image } from "../../atoms";
import clock from "../../../assets/svg/clock.svg";

const Header = () => {
    return (
        <div className="flex p-4 justify-between ml-20">   
            <Title>Inès BOURHIM </Title>
            <Image src={clock} alt="Absence" className="w-8 h-8 rounded-full" />
        </div>
    );
}

export default Header;