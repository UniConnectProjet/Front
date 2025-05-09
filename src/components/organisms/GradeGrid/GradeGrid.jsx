import React from "react";
import { GradeCard } from "../../molecules";
import { Title } from "../../atoms";

const GradeGrid = ({ grades }) => {
    return (
        <div className="flex flex-col p-4 w-2/3 bg-gray-100 rounded-lg shadow-md ml-20">
            <Title className=" text-black text-lg">Notes : </Title>
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
        </div>
    );
}

export default GradeGrid;