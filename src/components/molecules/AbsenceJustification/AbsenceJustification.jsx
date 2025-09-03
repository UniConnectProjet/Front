import React from "react";
import PropTypes from "prop-types";
import { Button, Image, Title, Text } from "../../atoms";
import exclamation from "../../../assets/svg/exclamation.svg";

const AbsenceJustification = ({ justification, title, date, hours, className = "", disabled = false }) => {
    // Déterminer les styles du bouton selon l'état
    const getButtonStyles = () => {
        if (disabled || title === "Justifiée") {
            return "px-3 py-1 border-gray-300 bg-gray-100 rounded-md text-gray-500 cursor-not-allowed";
        } else if (title === "En cours") {
            return "px-3 py-1 border-yellow-500 bg-yellow-100 rounded-md text-yellow-600 cursor-not-allowed";
        } else {
            return "px-3 py-1 border-primary-500 bg-primary-100 rounded-md text-primary-500 hover:bg-primary-200";
        }
    };

    return (
        <div className={`flex p-2 mr-4 justify-between ${className}`}>
            <div className="flex p-2 items-center">
                <Image src={exclamation} alt="UnjustifiedAbsence" className="w-8 h-8 rounded-full" />
                <div className="flex flex-col justify-between p-2">
                    <Title className="text-sm font-bold text-gray-800">{date}</Title>
                    <Text>{hours}</Text>
                </div>
            </div>
            <div className="flex p-2 justify-center items-center">
                <Button 
                    onClick={disabled || title === "Justifiée" || title === "En cours" ? () => {} : justification} 
                    className={getButtonStyles()}
                    disabled={disabled || title === "Justifiée" || title === "En cours"}
                >
                    {title}
                </Button>
            </div>
        </div>
    );
}

AbsenceJustification.propTypes = {
    justification: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    hours: PropTypes.string.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

export default AbsenceJustification;