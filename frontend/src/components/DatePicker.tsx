import React, { useEffect, useState } from "react";
import "./../styles/Date.scss";
import LeftArrowSvg from "./../assets/left-arrow.svg";
import RightArrowSvg from "./../assets/right-arrow.svg";
import usePersistState from "../hooks/usePersistState";
import { printDate } from "../util";

const DatePicker: React.FC = () => {
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (getDate() == undefined) {
      localStorage.setItem("date", JSON.stringify(new Date()));
    }
    setDate(getDate());
  }, []);

  const getDate = () => {
    return new Date(JSON.parse(localStorage.getItem("date")));
  };

  const decrementDate = () => {
    date.setDate(date.getDate() - 1);
    localStorage.setItem("date", JSON.stringify(date));
    setDate(getDate());
  };

  const incrementDate = () => {
    date.setDate(date.getDate() + 1);
    localStorage.setItem("date", JSON.stringify(date));
    setDate(getDate());
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
