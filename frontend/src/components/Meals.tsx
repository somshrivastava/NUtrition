import React, { useState } from "react";
import "./../styles/Meals.scss";
import { Food } from "../schema.type";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber"; // ✅ Import for serving size edit

interface InputProps {
  title: string;
  meals: Food[];
  onDelete: (index: number) => void;
  onEdit: (index: number, newServingSize: number) => void;
}

const Meals: React.FC<InputProps> = ({ title, meals, onDelete, onEdit }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newServingSize, setNewServingSize] = useState<number | null>(null);

  return (
    <div className="page-meals">
      <h1 className="page-meals-title">{title}</h1>
      <div className="page-meals-items">
        {meals.map((meal: Food, index: number) => (
          <div key={index} className="page-meals-item">
            <h3 className="page-meals-item-title">{meal.name}</h3>

            {editingIndex === index ? (
              <InputNumber
                value={newServingSize !== null ? newServingSize : meal.servingSize.value} // ✅ Mirror current serving size
                onValueChange={(e) => setNewServingSize(e.value || meal.servingSize.value)}
                min={1}
                step={1}
                suffix={` ${meal.servingSize.unit}`}
              />
            ) : (
              <p>
                Serving Size: {meal.servingSize.value} {meal.servingSize.unit}
              </p>
            )}

            <div className="meal-actions">
              {editingIndex === index ? (
                <>
                  <Button
                    label="Save"
                    onClick={() => {
                      onEdit(
                        index,
                        newServingSize !== null ? newServingSize : meal.servingSize.value
                      );
                      setEditingIndex(null);
                      setNewServingSize(null);
                    }}
                  />
                  <Button label="Cancel" onClick={() => setEditingIndex(null)} />
                </>
              ) : (
                <Button
                  label="Edit"
                  onClick={() => {
                    setEditingIndex(index);
                    setNewServingSize(meal.servingSize.value);
                  }}
                />
              )}
              <Button label="Delete" severity="danger" onClick={() => onDelete(index)} />
            </div>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meals;
