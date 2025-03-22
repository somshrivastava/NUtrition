import React, { useEffect, useState } from "react";
import "./../styles/Date.scss";
import LeftArrowSvg from "./../assets/left-arrow.svg";
import RightArrowSvg from "./../assets/right-arrow.svg";
import { printDate, getDate } from "../util";

const DatePicker: React.FC<{
  onDateChange: (newDate: Date) => void;
}> = ({ onDateChange }) => {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("date")) {
      // TODO: needs to be changed before deployment
      sessionStorage.setItem("date", JSON.stringify(new Date()));
      // sessionStorage.setItem("date", JSON.stringify(new Date(2025, 1, 23)));
    }
    const storedDate = getDate();
    setDate(storedDate);
    onDateChange(storedDate);
  }, []);

  const changeDate = (days: number) => {
    if (!date) return;
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    sessionStorage.setItem("date", JSON.stringify(newDate));
    setDate(newDate);
    onDateChange(newDate);
  };

  return (
    <div className="date">
      <img
        onClick={() => changeDate(-1)}
        className="date-left-arrow"
        src={LeftArrowSvg}
        alt="Left Arrow SVG"
      />
      <h2 className="date-name">{date ? printDate(date) : ""}</h2>
      <img
        onClick={() => changeDate(1)}
        className="date-right-arrow"
        src={RightArrowSvg}
        alt="Right Arrow SVG"
      />
    </div>
  );
};

export default DatePicker;
