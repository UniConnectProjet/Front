import React from "react";
import PropTypes from "prop-types";
import { GradeCard } from "../../molecules";
import { Title, OverallAverage } from "../../atoms";

const GradeGrid = ({ grades }) => {
    return (
        <div className="flex flex-col w-full lg:w-3/5 p-4 bg-gray-100 rounded-lg shadow-md">
            <Title className="text-buttonColor-500 text-lg mb-2">Notes :</Title>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {grades.map((grade, index) => (
                    <GradeCard
                        key={index}
                        title={grade.title}
                        score={grade.score}
                        total={grade.total}
                    />
                ))}
            </div>

            <div className="mt-4">
                <OverallAverage 
                    score="14"
                    titleOverallAverage="Moyenne générale :"
                    total="20"
                    className="flex justify-between items-center border p-2 bg-white border-primary-300"
                />
            </div>
        </div>
    );
};

GradeGrid.propTypes = {
    grades: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            score: PropTypes.number.isRequired,
            total: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default GradeGrid;
