import React from "react";
import PropTypes from "prop-types";
import { Button, Image, Title, Text } from "../../atoms";
import exclamation from "../../../assets/svg/exclamation.svg";

const AbsenceJustification = ({ justification, title, date, hours, className = "", disabled = false, hideButton = false }) => {
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

    // Déterminer la couleur de l'icône selon le statut
    const getIconColor = () => {
        if (title === "Justifiée") {
            return "w-8 h-8 rounded-full bg-green-100 p-1";
        } else if (title === "En cours") {
            return "w-8 h-8 rounded-full bg-yellow-100 p-1";
        } else {
            return "w-8 h-8 rounded-full bg-red-100 p-1";
        }
    };

    return (
        <div className={`flex p-2 mr-4 justify-between ${className}`}>
            <div className="flex p-2 items-center">
                <div className={getIconColor()}>
                    <Image src={exclamation} alt="Absence" className="w-6 h-6" />
                </div>
                <div className="flex flex-col justify-between p-2">
                    <Title className="text-sm font-bold text-gray-800">{date}</Title>
                    <Text>{hours}</Text>
                    {hideButton && (
                        <Text className={`text-xs font-medium ${
                            title === "Justifiée" ? "text-green-600" :
                            title === "En cours" ? "text-yellow-600" :
                            "text-red-600"
                        }`}>
                            {title}
                        </Text>
                    )}
                </div>
            </div>
            {!hideButton && (
                <div className="flex p-2 justify-center items-center">
                    <Button 
                        onClick={disabled || title === "Justifiée" || title === "En cours" ? () => {} : justification} 
                        className={getButtonStyles()}
                        disabled={disabled || title === "Justifiée" || title === "En cours"}
                    >
                        {title}
                    </Button>
                </div>
            )}
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
    hideButton: PropTypes.bool,
};

export default AbsenceJustification;