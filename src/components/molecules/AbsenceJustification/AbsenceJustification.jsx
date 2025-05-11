import React from "react";
import PropTypes from "prop-types";
import { Button, Image, Title, Text } from "../../atoms";
import exclamation from "../../../assets/svg/exclamation.svg";

const AbsenceJustification = ({ justification, title, date, hours, className = "" }) => {
    return (
        <div className={`flex p-2 mr-4 justify-between ${className}`}>
            <div className="flex p-2">
                <Image src={exclamation} alt="UnjustifiedAbsence" className="w-8 h-8 rounded-full" />
                <div className="flex flex-col justify-between p-2">
                    <Title className="text-sm font-bold text-gray-800">{date}</Title>
                    <Text>{hours}</Text>
                </div>
            </div>
            <div className="p-2">
                <Button onClick={justification} className="px-3 py-1 border-primary-500 bg-gray-200 rounded-md text-primary-500">
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
};

export default AbsenceJustification;