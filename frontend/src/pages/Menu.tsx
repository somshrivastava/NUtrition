import React, { useEffect, useState } from "react";
import "./../styles/Menu.scss";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DailyLog, Menu } from "../schema.type";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import DatePicker from "../components/DatePicker";
import { getMenus, unsubscribeMenusChannel } from "../services/menu.service";
import { getDate, printDate } from "../util";
import { getDailyLogs, unsubscribeDailyLogsChannel } from "../services/daily-log.service";
import { useAuth } from "../hooks/useAuth";

const diningHalls = [{ name: "International Village" }, { name: "Stetson East" }];

const Menu: React.FC = () => {
  const [selectedDiningHall, setSelectedDiningHall] = useState<{ name: string }>(diningHalls[0]);
  const [servingSize, setServingSize] = useState<number>(null);
  const [menus, setMenus] = useState<Menu[]>(null);
  const [selectedMenu, setSelectedMenu] = useState<Menu>(null);
  const [selectedMealTime, setSelectedMealTime] = useState<string>("Breakfast");
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>();
  const [selectedDailyLog, setSelectedDailyLog] = useState<DailyLog>();
  const { user, setUser } = useAuth();

  useEffect(() => {
    getMenus(setMenus, onLoadMenus);
    getDailyLogs(setDailyLogs, onLoadDailyLogs);
    return () => {
      unsubscribeMenusChannel();
      unsubscribeDailyLogsChannel();
    };
  }, []);

  const onLoadDailyLogs = (loadedDailyLogs: DailyLog[]) => {
    console.log(user.uid);
    const searchForDailyLog = loadedDailyLogs.find(
      (dailyLog: DailyLog) =>
        dailyLog.uid == user.uid && printDate(new Date(dailyLog.date)) == printDate(getDate())
    );
    console.log(searchForDailyLog);
  };

  const onLoadMenus = (loadedMenus: Menu[]) => {
    findMenu(loadedMenus);
  };

  const findMenu = (loadedMenus?: Menu[], mealTime?: string, diningHall?: string) => {
    setSelectedMenu(
      (loadedMenus ? loadedMenus : menus).find(
        (menu: Menu) =>
          printDate(new Date(menu.date)) == printDate(getDate()) &&
          menu.diningHall == (diningHall ? diningHall : selectedDiningHall.name) &&
          menu.mealTime == (mealTime ? mealTime : selectedMealTime)
      )
    );
  };

  const selectMealTime = (mealTime: string) => {
    setSelectedMealTime(mealTime);
    findMenu(null, mealTime, null);
  };

  const selectDiningHall = (diningHall: { name: string }) => {
    setSelectedDiningHall(diningHall);
    findMenu(null, null, diningHall.name);
  };

  return (
    <>
      <div className="page">
        <DatePicker />
        <div className="page-dining-hall">
          <Dropdown
            value={selectedDiningHall}
            onChange={(e) => selectDiningHall(e.value)}
            options={diningHalls}
            optionLabel="name"
            placeholder="Select a Dining Hall"
          />
        </div>
        <div className="page-timing">
          <h3 className="page-timing-title">8:00 AM to 10:00 PM</h3>
        </div>
        <div className="page-mealtime">
          <Button
            className="page-mealtime-breakfast"
            label="Breakfast"
            severity={selectedMealTime == "Breakfast" ? "danger" : "secondary"}
            onClick={() => {
              selectMealTime("Breakfast");
            }}
          />
          <Button
            className="page-mealtime-lunch"
            label="Lunch"
            severity={selectedMealTime == "Lunch" ? "danger" : "secondary"}
            onClick={() => {
              selectMealTime("Lunch");
            }}
          />
          <Button
            className="page-mealtime-dinner"
            label="Dinner"
            severity={selectedMealTime == "Dinner" ? "danger" : "secondary"}
            onClick={() => {
              selectMealTime("Dinner");
            }}
          />
        </div>
        <div className="page-menu">
          <div className="page-menu-section">
            <h1 className="page-menu-section-title">Cucina</h1>
            <div className="page-menu-section-items">
              {selectedMenu != null
                ? selectedMenu.foods.map((item) => (
                    <div key={item.docId as React.Key} className="page-menu-section-item">
                      <div className="page-menu-section-item-content">
                        <h3 className="page-menu-section-item-content-title">{item.name}</h3>
                        <p className="page-menu-section-item-content-description">
                          {item.description}
                        </p>
                      </div>
                      <div className="page-menu-section-item-buttons">
                        <InputNumber
                          className="page-menu-section-item-serving-size"
                          value={servingSize}
                          onValueChange={(e: InputNumberValueChangeEvent) =>
                            setServingSize(e.value)
                          }
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
                  ))
                : ""}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
