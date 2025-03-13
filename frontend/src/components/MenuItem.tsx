import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { DailyLog, Food } from "../schema.type";

const MenuItem: React.FC<{
  item: Food;
  dailyLog: DailyLog;
  addFood: (food: Food, servingSize: number) => void;
}> = ({ item, dailyLog, addFood }) => {
  const [servingSize, setServingSize] = useState<number>(1);

  return (
    <div key={item.docId} className="page-menu-section-item">
      <div className="page-menu-section-item-content">
        <h3 className="page-menu-section-item-content-title">{item.name}</h3>
        <p className="page-menu-section-item-content-description">{item.description}</p>
      </div>
      <div className="page-menu-section-item-buttons">
        <InputNumber
          className="page-menu-section-item-serving-size"
          value={servingSize}
          onValueChange={(e: InputNumberValueChangeEvent) => setServingSize(e.value || 0)}
          mode="decimal"
          showButtons
          min={0}
          max={100}
        />
        <Button label="Add +" severity="success" onClick={() => addFood(item, servingSize)} />
      </div>
    </div>
  );
};

export default MenuItem;
