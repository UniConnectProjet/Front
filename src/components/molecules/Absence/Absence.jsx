import React from "react";
import PropTypes from "prop-types";
import { Text, Title, Image } from "../../atoms";
import clock from "../../../assets/svg/clock.svg";

const Absence = ({ title, date, className = '' }) => {
    return (
        <div className={`flex p-2 mr-4 items-center ${className}`}>
            <Image src={clock} alt="Absence" className="w-8 h-8 rounded-full" />
            <div className="flex flex-col justify-between p-2">
                <Title className="text-sm font-bold text-gray-800">{title}</Title>
                <Text>{date}</Text>
            </div>
        </div>
    );
}

Absence.propTypes = {
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default Absence;