import React from "react";
import { Title } from "../../atoms";
import { Absence } from "../../molecules";

const UnjustifiedAbsences = () => {
    const absences = [
        { title: "Absence injustifié", date: "Le 15/05/2023 de 16h à 19h30" },
        { title: "Absence injustifié", date: "Le 15/05/2023 de 16h à 19h30" },
        { title: "Absence injustifié", date: "Le 15/05/2023 de 16h à 19h30" },
        { title: "Absence injustifié", date: "Le 15/05/2023 de 16h à 19h30" },
    ];

    return (
        <div className="flex flex-col p-4 bg-gray-100 rounded-lg shadow-md max-h-fit">   
            <Title className="text-buttonColor-500 text-lg">Absences : </Title>
            {absences.map((absence, index) => (
                <Absence key={index} title={absence.title} date={absence.date} />
            ))}
        </div>
    );
}

export default UnjustifiedAbsences;