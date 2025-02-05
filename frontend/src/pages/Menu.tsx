import React, { useEffect, useState } from "react";
import "./../styles/Menu.scss";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Foods, FoodStation } from "../schema.type";
import Date from "../components/Date";

const Menu: React.FC = () => {
  const [selectedDiningHall, setSelectedDiningHall] = useState(null);
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
    ],
    lunch: [],
    dinner: [],
    everyday: [],
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
                      {item.name}
                    </h3>
                    <p className="page-menu-section-item-content-description">
                      {item.description}
                    </p>
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
