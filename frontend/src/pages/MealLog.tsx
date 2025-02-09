import React from "react";
import "./../styles/Menu.scss";
import Date from "../components/Date";
import "./../styles/MealLog.scss";
import MacrosChart from "../components/MacrosChart";
import Legend from "../components/Legend";
import Meals from "../components/Meals";

const MealLog: React.FC = () => {
  return (
    <>
      <div className="page">
        <Date />
        <div className="page-calories">
          <div className="page-calories-value">
            <div className="page-calories-value-consumed"></div>
            <div className="page-calories-value-goal"></div>
          </div>
          <div className="page-calories-bar">
            <div className="page-calories-bar-consumed"></div>
          </div>
        </div>
        <div className="page-pie-chart">
          <MacrosChart />
        </div>
        <Legend />
        <Meals />
      </div>
    </>
  );
};

export default MealLog;
