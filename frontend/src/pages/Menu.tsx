import React, { useEffect, useState } from "react";
import "./../styles/Menu.scss";
import LeftArrowSvg from "./../assets/left-arrow.svg";
import RightArrowSvg from "./../assets/right-arrow.svg";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const Menu: React.FC = () => {
  const [selectedDiningHall, setSelectedDiningHall] = useState(null);
  const diningHalls = [{ name: "International Village" }, { name: "Stetson East" }];

  return (
    <>
      <div className="page">
        <div className="page-date">
          <img className="page-date-left-arrow" src={LeftArrowSvg} alt="Left Arrow SVG" />
          <h2 className="page-date-name">December 22nd, Sunday</h2>
          <img className="page-date-right-arrow" src={RightArrowSvg} alt="Right Arrow SVG" />
        </div>
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
