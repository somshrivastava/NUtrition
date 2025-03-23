import React, { useEffect, useState } from "react";

import { getDateFromSessionStorage, printDate } from "../util";
import LeftArrowSvg from "./../assets/left-arrow.svg";
import RightArrowSvg from "./../assets/right-arrow.svg";

import "./../styles/Date.scss";

interface InputProps {
  onDateChange: (newDate: Date) => void;
}

const DatePicker: React.FC<InputProps> = ({ onDateChange }) => {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    // if there is no date in session storage, set the date to today's date
    if (!sessionStorage.getItem("date")) {
      sessionStorage.setItem("date", JSON.stringify(new Date()));
    }
    setDate(getDateFromSessionStorage());
    onDateChange(getDateFromSessionStorage());
  }, []);

  const changeDate = (days: number) => {
    if (date) {
      // create a date object that is {days} ahead of the current date
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + days);
      // update the current date and send to the callback function
      sessionStorage.setItem("date", JSON.stringify(newDate));
      setDate(newDate);
      onDateChange(newDate);
    }
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
