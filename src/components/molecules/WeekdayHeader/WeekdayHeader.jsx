import React from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");

const WeekdayHeader = ({ selectedDate, onSelect }) => {
  const startOfWeek = dayjs().startOf("week").add(1, "day"); // lundi

  const days = [...Array(7)].map((_, i) => {
    const date = startOfWeek.add(i, "day");
    return {
      label: date.format("ddd").toUpperCase(),
      dayNumber: date.format("D"),
      dateObj: date.toDate(),
    };
  });

  return (
    <div className="flex justify-between overflow-x-auto mb-4 px-2 md:hidden">
      {days.map((day, i) => {
        const isSelected = dayjs(selectedDate).isSame(day.dateObj, "day");
        return (
          <button
            key={i}
            onClick={() => onSelect(day.dateObj)}
            className={`flex flex-col items-center mx-1 px-3 py-1 rounded-md ${
              isSelected
                ? "bg-cyan-500 text-white font-bold"
                : "text-gray-700"
            }`}
          >
            <span className="text-xs">{day.label}</span>
            <span className="text-sm">{day.dayNumber}</span>
          </button>
        );
      })}
    </div>
  );
};

WeekdayHeader.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default WeekdayHeader;