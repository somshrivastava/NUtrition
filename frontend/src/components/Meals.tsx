import React, { useState } from "react";
import "./../styles/Meals.scss";
import { Food } from "../schema.type";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

interface InputProps {
  title: string;
  meals: Food[];
  onDelete: (index: number) => void;
  onEdit: (index: number, newServingSize: number) => void;
}

const Meals: React.FC<InputProps> = ({ title, meals, onDelete, onEdit }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newServingSize, setNewServingSize] = useState<number | null>(null);

  const editFood = (index: number, meal: Food): React.MouseEventHandler<HTMLButtonElement> => {
    return () => {
      setEditingIndex(index);
      setNewServingSize(meal.servings);
    };
  };

  const saveFood = (index: number, meal: Food): React.MouseEventHandler<HTMLButtonElement> => {
    console.log("asdfasdf");
    return () => {
      onEdit(index, newServingSize !== null ? newServingSize : meal.servings);
      setEditingIndex(null);
      setNewServingSize(null);
    };
  };

  return (
    <div className="page-meals">
      <h1 className="page-meals-title">{title}</h1>
      <div className="page-meals-items">
        {meals.map((meal: Food, index: number) => (
          <div key={index} className="page-meals-item">
            <h3 className="page-meals-item-title">{meal.name}</h3>
            <div className="page-meals-item-macros">
              <div className="page-meals-item-macros-calories">
                {meal.nutritionalInfo.calories.value}
                {meal.nutritionalInfo.calories.unit}
              </div>
              <div className="page-meals-item-macros-carbohydrates">
                {meal.nutritionalInfo.carbohydrates.value}
                {meal.nutritionalInfo.carbohydrates.unit}
              </div>
              <div className="page-meals-item-macros-protein">
                {meal.nutritionalInfo.protein.value}
                {meal.nutritionalInfo.protein.unit}
              </div>
              <div className="page-meals-item-macros-fat">
                {meal.nutritionalInfo.fat.value}
                {meal.nutritionalInfo.fat.unit}
              </div>
              <div className="page-meals-actions">
                {editingIndex === index ? (
                  <Button
                    className="page-meals-actions-button"
                    icon="pi pi-check"
                    onClick={() => {
                      console.log("Edited");
                      onEdit(
                        index,
                        newServingSize !== null ? newServingSize : meal.servingSize.value
                      );
                      setEditingIndex(null);
                      setNewServingSize(null);
                    }}
                  />
                ) : (
                  <Button
                    className="page-meals-actions-button"
                    icon="pi pi-pencil"
                    onClick={() => {
                      console.log("Editing");
                      setEditingIndex(index);
                      setNewServingSize(meal.servings);
                    }}
                  />
                )}
                <Button
                  className="page-meals-actions-button"
                  icon="pi pi-times"
                  severity="danger"
                  onClick={() => onDelete(index)}
                />
              </div>
            </div>
            {editingIndex === index ? (
              <InputNumber
                className="page-meals-item-input"
                value={newServingSize !== null ? newServingSize : meal.servings}
                onValueChange={(e) => setNewServingSize(e.value || meal.servings)}
                min={1}
                step={1}
              />
            ) : (
              <p className="page-meals-item-serving-size">Servings: {meal.servings}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meals;
