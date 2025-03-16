import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Food } from "../schema.type";

interface MenuItemProps {
  item: Food;
  addFood: (food: Food, servingSize: number) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, addFood }) => {
  const [servingSize, setServingSize] = useState<number>(1);

  return (
    <div className="page-menu-section-item">
      <div className="page-menu-section-item-content">
        <h3 className="page-menu-section-item-content-title">{item.name}</h3>
        <p className="page-menu-section-item-content-description">{item.description}</p>
      </div>
      <div className="page-menu-section-item-buttons">
        <InputNumber
          className="page-menu-section-item-serving-size"
          value={servingSize}
          onValueChange={(e) => setServingSize(e.value || 1)}
          mode="decimal"
          showButtons
          min={1}
          max={100}
        />
        <Button label="Add +" severity="success" onClick={() => addFood(item, servingSize)} />
      </div>
    </div>
  );
};

export default MenuItem;
