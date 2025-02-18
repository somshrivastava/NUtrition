import React, { useState } from "react";
import { Button } from "primereact/button";
import "./../styles/History.scss";
import Legend from "./../components/Legend";
import Meals from "./../components/Meals";
import { Dropdown } from "primereact/dropdown";

import { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const History: React.FC = () => {

  const Times = [{ time: "current" }, { time: "1 Day ago" }, { time: "past 3 days" }, { time: "past 7 days" }];

  const [selectedTime, setselectedTime] = useState(null);

  



const data = [
  {
    name: 'Monday',
    calories: 4000,
    
  },
  {
    name: 'Tuesday',
    calories: 2000,
  },
  {
    name: 'Wednesday',
    calories: 1500,
  },
  {
    name: 'Thursday',
    calories: 3000,
  },
  {
    name: 'Friday',
    calories: 3000,
  },
  {
    name: 'Saturday',
    calories: 3500,
  },
  {
    name: 'Sunday',
    calories: 5000,
  },
];

const data1 = [ {name: 'Monday', calories: 2000,}, { name: 'Tuesday', calories: 2000,},
{name: 'Wednesday', calories: 1500,},{name: 'Thursday', calories: 5000,},{name: 'Friday', calories: 1000,},
  {name: 'Saturday', calories: 1700,},{ name: 'Sunday',calories: 2200,},];


const [selectedData, setSelectedData] = useState(data);


  const DropDownChange = (e) => {
    setselectedTime(e.value)

    if (e.value.time == "current") {
      setSelectedData(data);
    } else  {
      setSelectedData(data1);
    }


  }





  return (
    <>
      <div className="page">
        <div className="page-history-time">
          <Dropdown
            value={selectedTime}
            //onChange={(e) => setselectedTime(e.value)}
            onChange={DropDownChange}
            options={Times}
            optionLabel="time"
            placeholder="Select Time"
          />
        </div>
        <div className="page-line-graph">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={selectedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="calories" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
      </ResponsiveContainer>
        </div>
        <Legend />
        <div className="page-boxes">
          <div className="page-boxes-row">
            <Button className="page-boxes-calories" label="calories" severity="danger" />
            <Button className="page-boxes-carbohydrates" label="carbs" />
          </div>
          <div className="page-boxes-row">
            <Button className="page-boxes-protein" label="pro" />
            <Button className="page-boxes-fat" label="fat" />
          </div>
        </div>
        <Meals />







      </div>

    </>


  );
};

export default History;
