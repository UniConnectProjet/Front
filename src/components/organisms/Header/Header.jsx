import React from "react";
import { Title, Image } from "../../atoms";
import user from "../../../assets/svg/user.svg";

const Header = () => {
    return (
        <div className="flex py-4 justify-between items-center ml-10">   
            <Title>Inès BOURHIM </Title>
            <Image src={user} alt="User" className="w-10 h-10 rounded-full hidden md:block" />
        </div>
    );
}

export default Header;