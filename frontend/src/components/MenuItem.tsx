import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { Food } from "../schema.type";

interface MenuItemProps {
  item: Food;
  addFood: (food: Food, servingSize: number) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, addFood }) => {
  const [servingSize, setServingSize] = useState<number>(1);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const openDialog = (e: React.MouseEvent) => {
    // Prevent opening dialog when clicking buttons
    if (
      !(e.target as HTMLElement).closest(".p-button") &&
      !(e.target as HTMLElement).classList.contains("p-inputnumber")
    ) {
      setShowDialog(true);
    }
  };

  return (
    <>
      <div className="page-menu-section-item">
        <div className="page-menu-section-item-content" onClick={openDialog}>
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
          <Button
            label="Add +"
            severity="success"
            className="w-full page-menu-section-item-add-button"
            onClick={() => addFood(item, servingSize)}
          />
        </div>
      </div>

      <Dialog
        header={item.name}
        visible={showDialog}
        style={{ width: "400px" }}
        onHide={() => setShowDialog(false)}
        draggable={false}
        resizable={false}
        closable
      >
        <p className="mb-3">
          <strong>Description:</strong> {item.description}
        </p>
        <p className="mb-3">
          <strong>Serving Size:</strong> {item.servingSize.value} {item.servingSize.unit}
        </p>
        <p className="mb-3">
          <strong>Nutritional Info (per serving):</strong>
        </p>
        <ul style={{ paddingLeft: "1rem" }}>
          <li>
            Calories: {item.nutritionalInfo.calories.value} {item.nutritionalInfo.calories.unit}
          </li>
          <li>
            Carbs: {item.nutritionalInfo.carbohydrates.value}{" "}
            {item.nutritionalInfo.carbohydrates.unit}
          </li>
          <li>
            Protein: {item.nutritionalInfo.protein.value} {item.nutritionalInfo.protein.unit}
          </li>
          <li>
            Fat: {item.nutritionalInfo.fat.value} {item.nutritionalInfo.fat.unit}
          </li>
          <li>
            Saturated Fat: {item.nutritionalInfo.saturatedFat.value}{" "}
            {item.nutritionalInfo.saturatedFat.unit}
          </li>
          <li>
            Fiber: {item.nutritionalInfo.dietaryFiber.value}{" "}
            {item.nutritionalInfo.dietaryFiber.unit}
          </li>
          <li>
            Sodium: {item.nutritionalInfo.sodium.value} {item.nutritionalInfo.sodium.unit}
          </li>
          <li>
            Potassium: {item.nutritionalInfo.potassium.value} {item.nutritionalInfo.potassium.unit}
          </li>
          <li>
            Calcium: {item.nutritionalInfo.calcium.value} {item.nutritionalInfo.calcium.unit}
          </li>
          <li>
            Iron: {item.nutritionalInfo.iron.value} {item.nutritionalInfo.iron.unit}
          </li>
        </ul>
      </Dialog>
    </>
  );
};

export default MenuItem;
