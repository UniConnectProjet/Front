import React from "react";
import PropTypes from "prop-types";
import { Text, Title, Image } from "../../atoms";
import clock from "../../../assets/svg/clock.svg";

const Absence = ({ title, date, className = "", onClick }) => {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={[
        "flex items-center p-2 mr-4 rounded-lg",
        onClick ? "cursor-pointer hover:bg-text-100 focus:outline-none focus:ring-2 focus:ring-primary-400 transition" : "",
        className,
      ].join(" ")}
    >
      <Image src={clock} alt="Absence" className="w-8 h-8 rounded-full" />
      <div className="flex flex-col justify-between p-2">
        <Title className="text-sm font-bold text-gray-800">{title}</Title>
        <Text>{date}</Text>
      </div>
    </Wrapper>
  );
};

Absence.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Absence;