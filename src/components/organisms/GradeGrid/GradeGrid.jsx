import React from "react";
import { GradeCard } from "../../molecules";
import { Title, OverallAverage } from "../../atoms";

const GradeGrid = ({ grades }) => {
    return (
        <div className="flex flex-col p-4 w-3/5 bg-gray-100 rounded-lg shadow-md ml-20">
            <Title className=" text-buttonColor-500 text-lg">Notes : </Title>
            <div className="grid grid-cols-2">
                {grades.map((grade, index) => (
                    <GradeCard
                        key={index}
                        title={grade.title}
                        score={grade.score}
                        total={grade.total}
                    />
                ))}
            </div>
            <OverallAverage 
                score="14"
                titleOverallAverage="Moyenne générale :"
                total="20"
                className="flex justify-between items-center border p-2 bg-white border-primary-300"/>
        </div>
    );
}

export default GradeGrid;