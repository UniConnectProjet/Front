import React from "react";
import { GradeCard } from "../../molecules";
import { Title } from "../../atoms";

const GradeGrid = ({ grades }) => {
    return (
        <div className="flex flex-col gap-4 p-4 bg-gray-100">
            <Title className=" text-black text-lg">Notes : </Title>
            <div className="flex grid grid-cols-2 ">
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