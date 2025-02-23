import React, { useEffect, useState } from "react";
import "./../styles/Date.scss";
import LeftArrowSvg from "./../assets/left-arrow.svg";
import RightArrowSvg from "./../assets/right-arrow.svg";
import { printDate } from "../util";

const DatePicker: React.FC = () => {
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (getDate() == undefined) {
      sessionStorage.setItem("date", JSON.stringify(new Date()));
    }
    setDate(getDateObject(getDate()));
  }, []);

  const getDateObject = (str: Date) => {
    return new Date(str);
  };

  const getDate = () => {
    return JSON.parse(sessionStorage.getItem("date"));
  };

  const decrementDate = () => {
    date.setDate(date.getDate() - 1);
    sessionStorage.setItem("date", JSON.stringify(date));
    setDate(getDateObject(getDate()));
  };

  const incrementDate = () => {
    date.setDate(date.getDate() + 1);
    sessionStorage.setItem("date", JSON.stringify(date));
    setDate(getDateObject(getDate()));
  };

  return (
    <>
      <div className="date">
        <img
          onClick={decrementDate}
          className="date-left-arrow"
          src={LeftArrowSvg}
          alt="Left Arrow SVG"
        />
        <h2 className="date-name">{date ? printDate(date) : ""}</h2>
        <img
          onClick={incrementDate}
          className="date-right-arrow"
          src={RightArrowSvg}
          alt="Right Arrow SVG"
        />
      </div>
    </>
  );
};

export default DatePicker;
