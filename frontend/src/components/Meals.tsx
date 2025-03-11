import React from "react";
import "./../styles/Meals.scss";
import { Food } from "../schema.type";

interface InputProps {
  title: string;
  meals: Food[];
}

const Meals: React.FC<InputProps> = ({ title, meals }) => {
  return (
    <>
      <div className="page-meals">
        <h1 className="page-meals-title">{title}</h1>
        <div className="page-meals-items">
          {meals.map((meal: Food) => {
            return (
              <>
                {/* <div className="page-meals-item">
                  <h3 className="page-meals-item-title">{meal.name}</h3>
                  <p className="page-meals-item-serving-size">
                    Serving Size: {meal.servingSize.value}&nbsp;
                    {meal.servingSize.unit}
                  </p>
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
                </div> */}
                <div className="page-meals-item">
                  <h3 className="page-meals-item-title">{meal.name}</h3>
                  <p className="page-meals-item-serving-size">
                    Serving Size: {meal.servingSize}&nbsp;
                  </p>
                  <div className="page-meals-item-macros">
                    <div className="page-meals-item-macros-calories">
                      {meal.nutritionalInfo.calories}
                    </div>
                    <div className="page-meals-item-macros-carbohydrates">
                      {meal.nutritionalInfo.carbohydrates}
                    </div>
                    <div className="page-meals-item-macros-protein">
                      {meal.nutritionalInfo.protein}
                    </div>
                    <div className="page-meals-item-macros-fat">{meal.nutritionalInfo.fat}</div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Meals;
