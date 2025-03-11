import React from "react";
import "./../styles/Menu.scss";
import "./../styles/MealLog.scss";
import MacrosChart from "../components/MacrosChart";
import Legend from "../components/Legend";
import Meals from "../components/Meals";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
import DatePicker from "../components/DatePicker";
import { data } from "../sample.data";

const MealLog: React.FC = () => {
  return (
    <>
      <div className="page">
        <DatePicker />
        <div className="page-calories">
          <div className="page-calories-value">
            <div className="page-calories-value-consumed">450 / </div>
            <InputText className="page-calories-value-goal" keyfilter="int" placeholder="" />
            <div className="page-calories-value-units">cals</div>
          </div>
          <ProgressBar className="page-calories-bar" value={37}></ProgressBar>
        </div>
        <MacrosChart carbohydrates={33} protein={33} fat={33} />
        <Legend />
        {/* <Meals title="Logged Meals" meals={data} /> */}
      </div>
    </>
  );
};

export default MealLog;
