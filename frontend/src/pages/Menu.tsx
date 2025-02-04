import React, { useEffect, useState } from "react";
import "./../styles/Menu.scss";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

import Date from "../components/Date"; 

const Menu: React.FC = () => {
  const [selectedDiningHall, setSelectedDiningHall] = useState(null);
  const diningHalls = [{ name: "International Village" }, { name: "Stetson East" }];

  return (
    <>
    <Date/>
      <div className="page">
        
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
          <div className="page-mealtime-breakfast">
            <Button label="Breakfast" severity="danger" />
          </div>
          <div className="page-mealtime-lunch">
            <Button label="Lunch" />
          </div>
          <div className="page-mealtime-dinner">
            <Button label="Dinner" />
          </div>
        </div>
        <div className="page-menu">
          <div className="page-menu-section">
            <div className="page-menu-section-title">{/* insert title */}</div>
            <div className="page-menu-section-item">{/* insert item */}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
