import React, { useEffect, useState } from "react";
import "./../styles/Menu.scss";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DailyLog, Food, Foods, FoodStation, Menu } from "../schema.type";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import DatePicker from "../components/DatePicker";
import { getDailyLogsRealtime, unsubscribeDailyLogsChannel } from "../services/daily-log.service";
// import iv_breakfast_2_4 from "./../data/iv_Breakfast_2_4.json";
// import iv_lunch_2_4 from "./../data/iv_Lunch_2_4.json";
// import iv_dinner_2_4 from "./../data/iv_Dinner_2_4.json";
// import iv_breakfast_2_5 from "./../data/iv_Breakfast_2_5.json";
// import iv_lunch_2_5 from "./../data/iv_Lunch_2_5.json";
// import iv_dinner_2_5 from "./../data/iv_Dinner_2_5.json";
// import steast_breakfast_2_4 from "./../data/steast_Breakfast_2_4.json";
// import steast_lunch_2_4 from "./../data/steast_Lunch_2_4.json";
// import steast_dinner_2_4 from "./../data/steast_Dinner_2_4.json";
// import steast_breakfast_2_5 from "./../data/steast_Breakfast_2_5.json";
// import steast_lunch_2_5 from "./../data/steast_Lunch_2_5.json";
// import steast_dinner_2_5 from "./../data/steast_Dinner_2_5.json";
// import { addMenu } from "../services/menu.service";

const Menu: React.FC = () => {
  const [selectedDiningHall, setSelectedDiningHall] = useState(null);
  const [servingSize, setServingSize] = useState(null);
  const [dailyLogs, setDailyLogs] = useState(null);
  const diningHalls = [{ name: "International Village" }, { name: "Stetson East" }];

  useEffect(() => {
    // addMenu({
    //   date: new Date(2025, 1, 4).toLocaleString(),
    //   diningHall: "International Village",
    //   foods: [...iv_breakfast_2_4, ...iv_lunch_2_4, ...iv_dinner_2_4],
    // } as Omit<Menu, "docId">);
    // addMenu({
    //   date: new Date(2025, 1, 5).toLocaleString(),
    //   diningHall: "International Village",
    //   foods: [...iv_breakfast_2_5, ...iv_lunch_2_5, ...iv_dinner_2_5],
    // } as Omit<Menu, "docId">);
    // addMenu({
    //   date: new Date(2025, 1, 4).toLocaleString(),
    //   diningHall: "Stetson East",
    //   foods: [...steast_breakfast_2_4, ...steast_lunch_2_4, ...steast_dinner_2_4],
    // } as Omit<Menu, "docId">);
    // addMenu({
    //   date: new Date(2025, 1, 5).toLocaleString(),
    //   diningHall: "Stetson East",
    //   foods: [...steast_breakfast_2_4, ...steast_lunch_2_4, ...steast_dinner_2_4],
    // } as Omit<Menu, "docId">);
    getDailyLogsRealtime(setDailyLogs);
    return () => {
      unsubscribeDailyLogsChannel();
    };
  }, []);
  // TODO:
  // need to write a method that will take foods and rearrange the data
  // into an array of food stations with the foods associated with each food station

  return (
    <>
      <div className="page">
        <DatePicker />
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
          <Button className="page-mealtime-breakfast" label="Breakfast" severity="danger" />
          <Button className="page-mealtime-lunch" label="Lunch" severity="secondary" />
          <Button className="page-mealtime-dinner" label="Dinner" severity="secondary" />
        </div>
        <div className="page-menu">
          <div className="page-menu-section">
            <h1 className="page-menu-section-title">Cucina</h1>
            <div className="page-menu-section-items">
              {/* {foods.breakfast.map((item) => (
                <div key={item.docId as React.Key} className="page-menu-section-item">
                  <div className="page-menu-section-item-content">
                    <h3 className="page-menu-section-item-content-title">
                      English Breakfast Baked Beans (PR) (AG)
                    </h3>
                    <p className="page-menu-section-item-content-description">
                      Traditional tomato baked beans with maple and spices{" "}
                    </p>
                  </div>
                  <div className="page-menu-section-item-buttons">
                    <InputNumber
                      className="page-menu-section-item-serving-size"
                      value={servingSize}
                      onValueChange={(e: InputNumberValueChangeEvent) => setServingSize(e.value)}
                      mode="decimal"
                      showButtons
                      min={0}
                      max={100}
                    />
                    <Button
                      className="page-menu-section-item-add-button"
                      label="Add +"
                      severity="success"
                    />
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
