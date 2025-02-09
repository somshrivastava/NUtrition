import React from "react";
import "./../styles/Meals.scss";

const Meals: React.FC = () => {
  return (
    <>
      <div className="page-meals">
        <h1 className="page-meals-title">Logged Meals</h1>
        <div className="page-meals-items">
          <div className="page-meals-item">
            <h3 className="page-meals-item-title">English Breakfast Baked Beans</h3>
            <p className="page-meals-item-serving-size">Serving Size: 1</p>
            <div className="page-meals-item-macros">
              <div className="page-meals-item-macros-calories">360 cals</div>
              <div className="page-meals-item-macros-carbohydrates">10g</div>
              <div className="page-meals-item-macros-protein">25g</div>
              <div className="page-meals-item-macros-fat">25g</div>
            </div>
          </div>
          <div className="page-meals-item">
            <h3 className="page-meals-item-title">English Breakfast Baked Beans</h3>
            <p className="page-meals-item-serving-size">Serving Size: 1</p>
            <div className="page-meals-item-macros">
              <div className="page-meals-item-macros-calories">360 cals</div>
              <div className="page-meals-item-macros-carbohydrates">10g</div>
              <div className="page-meals-item-macros-protein">25g</div>
              <div className="page-meals-item-macros-fat">25g</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Meals;
