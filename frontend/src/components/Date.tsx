import React from "react";
import "./../styles/Date.scss";
import LeftArrowSvg from "./../assets/left-arrow.svg";
import RightArrowSvg from "./../assets/right-arrow.svg";

const Date: React.FC = () => {
  const date = [];

  return (
    <>
      <div className="date">
        <img className="date-left-arrow" src={LeftArrowSvg} alt="Left Arrow SVG" />
        <h2 className="date-name">December 22nd, Sunday</h2>
        <img className="date-right-arrow" src={RightArrowSvg} alt="Right Arrow SVG" />
      </div>
    </>
  );
};

export default Date;
