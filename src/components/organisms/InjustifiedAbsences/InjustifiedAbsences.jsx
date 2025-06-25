import React, { useState } from "react";
import { Title } from "../../atoms";
import { AbsenceJustification, Absence } from "../../molecules";
import { Select } from "../../atoms"; 

const InjustifiedAbsences = () => {
    const [selectedValue, setSelectedValue] = useState("semestre1");

    const handleSelectChange = (value) => {
        setSelectedValue(value);
    };

    const absences = [
        { justification: () => {}, title: "Justifier", date: "Mercredi 6 Septembre de 10h00 à 12h00", hours: "2h00 de cours manquées" },
        { justification: () => {}, title: "Justifier", date: "Mercredi 6 Septembre de 10h00 à 12h00", hours: "2h00 de cours manquées" },
        { justification: () => {}, title: "Justifier", date: "Mercredi 6 Septembre de 10h00 à 12h00", hours: "2h00 de cours manquées" },
        { justification: () => {}, title: "Justifier", date: "Mercredi 6 Septembre de 10h00 à 12h00", hours: "2h00 de cours manquées" },
    ];

    const options = [
        { value: "semestre1", label: "Semestre 1" },
        { value: "semestre2", label: "Semestre 2" }
    ];

    return (
        <div className="flex flex-col p-4 ml-20 w-full">   
            <Title>Absences</Title>
            <Select
                className="mb-4 w-1/4"
                options={options}
                onChange={handleSelectChange}
                value={selectedValue}
            />
            <div className="flex p-4 justify-between">
                <div className="flex flex-col p-2 mr-4 bg-gray-100 rounded-lg shadow-md max-h-fit w-2/3">
                    {absences.map((absence, index) => (
                        <AbsenceJustification key={index} justification={absence.justification} title={absence.title} date={absence.date} hours={absence.hours} />
                    ))}
                </div>
                <div className="flex flex-col p-2 bg-gray-100 rounded-lg shadow-md max-h-fit">
                    <Title className="text-xl font-bold text-primary-500">Récapitulatif</Title>
                    <div className="flex flex-col justify-between p-2">
                        <Absence title="Total des heures manquées" date="(Absences + retard)"  />
                        <Absence title="Absence injustifié" date="20h30"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InjustifiedAbsences;

