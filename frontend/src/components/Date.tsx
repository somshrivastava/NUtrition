import React, { useEffect, useState } from "react";
import "./../styles/Menu.scss";
import LeftArrowSvg from "./../assets/left-arrow.svg";
import RightArrowSvg from "./../assets/right-arrow.svg";

const Date: React.FC = () => {
  const date = [];

  return (
    <>
      <div className="page">
        <div className="page-date">
          <img className="page-date-left-arrow" src={LeftArrowSvg} alt="Left Arrow SVG" />
          <h2 className="page-date-name">December 22nd, Sunday</h2>
          <img className="page-date-right-arrow" src={RightArrowSvg} alt="Right Arrow SVG" />
        </div>
      </div>
    </>
  );
};


export default Date; 
