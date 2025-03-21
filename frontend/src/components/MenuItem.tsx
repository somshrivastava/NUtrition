import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Food } from "../schema.type";

interface MenuItemProps {
  item: Food;
  addFood: (food: Food, servingSize: number) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, addFood }) => {
  const [servingSize, setServingSize] = useState<number>(1);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const toastRef = useRef<any>(null);
  const navigate = useNavigate();

  const openDialog = (e: React.MouseEvent) => {
    if (
      !(e.target as HTMLElement).closest(".p-button") &&
      !(e.target as HTMLElement).classList.contains("p-inputnumber")
    ) {
      setShowDialog(true);
    }
  };

  const handleAdd = () => {
    addFood(item, servingSize);

    toastRef.current.show({
      severity: "success",
      summary: "Added to Meal Log",
      detail: (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span>{item.name} added successfully!</span>
          <Button
            className="p-button-sm p-button-text"
            label="Go to Meal Log"
            severity="danger"
            onClick={() => navigate("/meal-log")}
          />
        </div>
      ),
      life: 2500,
    });
  };

  return (
    <>
      <Toast ref={toastRef} position="bottom-center" />

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
            onClick={handleAdd}
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
        <p className="page-dialog-subtitle">
          <p className="page-dialog-subtitle-label">Description:</p>
          <p className="page-dialog-subtitle-value">{item.description}</p>
        </p>
        <p className="page-dialog-subtitle">
          <p className="page-dialog-subtitle-label">Serving Size:</p>
          <p className="page-dialog-subtitle-value">
            {item.servingSize.value} {item.servingSize.unit}
          </p>
        </p>
        <p className="page-dialog-subtitle">
          <p className="page-dialog-subtitle-label">Nutritional Information (per serving):</p>
        </p>
        <ul className="page-dialog-nutrition-list" style={{ paddingLeft: "1rem" }}>
          <li className="page-dialog-nutrition-list-item">
            <span className="page-dialog-nutrition-list-item-label">Calories: </span>
            <span className="page-dialog-nutrition-list-item-value">
              {item.nutritionalInfo.calories.value} {item.nutritionalInfo.calories.unit}
            </span>
          </li>
          <li className="page-dialog-nutrition-list-item">
            <span className="page-dialog-nutrition-list-item-label">Carbs: </span>
            <span className="page-dialog-nutrition-list-item-value">
              {item.nutritionalInfo.carbohydrates.value} {item.nutritionalInfo.carbohydrates.unit}
            </span>
          </li>
          <li className="page-dialog-nutrition-list-item">
            <span className="page-dialog-nutrition-list-item-label">Protein: </span>
            <span className="page-dialog-nutrition-list-item-value">
              {item.nutritionalInfo.protein.value} {item.nutritionalInfo.protein.unit}
            </span>
          </li>
          <li className="page-dialog-nutrition-list-item">
            <span className="page-dialog-nutrition-list-item-label">Fat: </span>
            <span className="page-dialog-nutrition-list-item-value">
              {item.nutritionalInfo.fat.value} {item.nutritionalInfo.fat.unit}
            </span>
          </li>
          <li className="page-dialog-nutrition-list-item">
            <span className="page-dialog-nutrition-list-item-label">Saturated Fat: </span>
            <span className="page-dialog-nutrition-list-item-value">
              {item.nutritionalInfo.saturatedFat.value} {item.nutritionalInfo.saturatedFat.unit}
            </span>
          </li>
          <li className="page-dialog-nutrition-list-item">
            <span className="page-dialog-nutrition-list-item-label">Fiber: </span>
            <span className="page-dialog-nutrition-list-item-value">
              {item.nutritionalInfo.dietaryFiber.value} {item.nutritionalInfo.dietaryFiber.unit}
            </span>
          </li>
          <li className="page-dialog-nutrition-list-item">
            <span className="page-dialog-nutrition-list-item-label">Sodium: </span>
            <span className="page-dialog-nutrition-list-item-value">
              {item.nutritionalInfo.sodium.value} {item.nutritionalInfo.sodium.unit}
            </span>
          </li>
          <li className="page-dialog-nutrition-list-item">
            <span className="page-dialog-nutrition-list-item-label">Potassium: </span>
            <span className="page-dialog-nutrition-list-item-value">
              {item.nutritionalInfo.potassium.value} {item.nutritionalInfo.potassium.unit}
            </span>
          </li>
          <li className="page-dialog-nutrition-list-item">
            <span className="page-dialog-nutrition-list-item-label">Calcium: </span>
            <span className="page-dialog-nutrition-list-item-value">
              {item.nutritionalInfo.calcium.value} {item.nutritionalInfo.calcium.unit}
            </span>
          </li>
          <li className="page-dialog-nutrition-list-item">
            <span className="page-dialog-nutrition-list-item-label">Iron: </span>
            <span className="page-dialog-nutrition-list-item-value">
              {item.nutritionalInfo.iron.value} {item.nutritionalInfo.iron.unit}
            </span>
          </li>
        </ul>
      </Dialog>
    </>
  );
};

export default MenuItem;
