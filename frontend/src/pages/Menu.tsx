import React, { useEffect, useState } from "react";
import "./../styles/Menu.scss";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Foods, FoodStation } from "../schema.type";
import Date from "../components/Date";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from "recharts";

const Menu: React.FC = () => {
  const [selectedDiningHall, setSelectedDiningHall] = useState(null);
  const [servingSize, setServingSize] = useState(null);
  const diningHalls = [{ name: "International Village" }, { name: "Stetson East" }];
  const foods: Foods = {
    breakfast: [
      {
        name: "English Breakfast Baked Beans",
        description: "Traditional tomato baked beans with maple and spices",
        foodStation: FoodStation.CUCINA,
        nutritionalInfo: null,
        servingSize: {
          value: 1,
          unit: "cup",
        },
        dietaryRestrictions: [
          {
            symbol: "AG",
            name: "Avoiding Gluten",
            description: "Menu items made without gluten containing ingredients",
          },
          {
            symbol: "VG",
            name: "Vegan",
            description: "Contains no animal-based ingredients or by-products",
          },
        ],
      },
      {
        name: "English Breakfast Baked Beans",
        description: "Traditional tomato baked beans with maple and spices",
        foodStation: FoodStation.CUCINA,
        nutritionalInfo: null,
        servingSize: {
          value: 1,
          unit: "cup",
        },
        dietaryRestrictions: [
          {
            symbol: "AG",
            name: "Avoiding Gluten",
            description: "Menu items made without gluten containing ingredients",
          },
          {
            symbol: "VG",
            name: "Vegan",
            description: "Contains no animal-based ingredients or by-products",
          },
        ],
      },
      {
        name: "English Breakfast Baked Beans",
        description: "Traditional tomato baked beans with maple and spices",
        foodStation: FoodStation.CUCINA,
        nutritionalInfo: null,
        servingSize: {
          value: 1,
          unit: "cup",
        },
        dietaryRestrictions: [
          {
            symbol: "AG",
            name: "Avoiding Gluten",
            description: "Menu items made without gluten containing ingredients",
          },
          {
            symbol: "VG",
            name: "Vegan",
            description: "Contains no animal-based ingredients or by-products",
          },
        ],
      },
    ],
    lunch: [],
    dinner: [],
    everyday: [],
  };

  const data = [
    { name: "Carbohydrates", value: 32 },
    { name: "Fat", value: 39 },
    { name: "Protein", value: 90 },
  ];

  const COLORS = ["#14B8A6", "#FACC15", "#6D71F9"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // TODO:
  // need to write a method that will take foods and rearrange the data
  // into an array of food stations with the foods associated with each food station

  return (
    <>
      <div className="page">
        <Date />
        <div className="page-dining-hall">
          <Dropdown
            value={selectedDiningHall}
            onChange={(e) => setSelectedDiningHall(e.value)}
            options={diningHalls}
            optionLabel="name"
            placeholder="Select a Dining Hall"
          />
        </div>
        {/* <div className="page-chart">
          <PieChart width={200} height={200}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div> */}
        <div className="page-timing">
          <h3 className="page-timing-title">8:00 AM to 10:00 PM</h3>
        </div>
        <div className="page-mealtime">
          <Button className="page-mealtime-breakfast" label="Breakfast" severity="danger" />
          <Button className="page-mealtime-lunch" label="Lunch" severity="secondary" />
          <Button className="page-mealtime-dinner" label="Dinner" severity="secondary" />
        </div>
        <div className="page-menu">
          <div className="page-menu-section">
            <h1 className="page-menu-section-title">Cucina</h1>
            <div className="page-menu-section-items">
              {foods.breakfast.map((item) => (
                <div className="page-menu-section-item">
                  <div className="page-menu-section-item-content">
                    <h3 className="page-menu-section-item-content-title">
                      English Breakfast Baked Beans (PR) (AG)
                    </h3>
                    <p className="page-menu-section-item-content-description">
                      Traditional tomato baked beans with maple and spices{" "}
                    </p>
                  </div>
                  <div className="page-menu-section-item-buttons">
                    <InputNumber
                      className="page-menu-section-item-serving-size"
                      value={servingSize}
                      onValueChange={(e: InputNumberValueChangeEvent) => setServingSize(e.value)}
                      mode="decimal"
                      showButtons
                      min={0}
                      max={100}
                    />
                    <Button
                      className="page-menu-section-item-add-button"
                      label="Add +"
                      severity="success"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
