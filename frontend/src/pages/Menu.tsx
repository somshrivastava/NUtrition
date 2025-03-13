import React, { useEffect, useState } from "react";
import "./../styles/Menu.scss";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DailyLog, DiningHall, Food, Menu } from "../schema.type";
import DatePicker from "../components/DatePicker";
import { getMenus, unsubscribeMenusChannel } from "../services/menu.service";
import { printDate, getDate } from "../util";
import {
  addDailyLog,
  getDailyLogs,
  unsubscribeDailyLogsChannel,
  updateDailyLog,
} from "../services/daily-log.service";
import { useAuth } from "../hooks/useAuth";
import MenuItem from "../components/MenuItem";

const diningHalls = Object.values(DiningHall);

const Menu: React.FC = () => {
  const [selectedDiningHall, setSelectedDiningHall] = useState<DiningHall>(
    DiningHall.INTERNATIONAL_VILLAGE
  );
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [selectedMealTime, setSelectedMealTime] = useState<string>("Breakfast");
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [selectedDailyLog, setSelectedDailyLog] = useState<DailyLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(getDate());

  useEffect(() => {
    setIsLoading(true);
    getMenus(setMenus, onLoadMenus);
    getDailyLogs(setDailyLogs, onLoadDailyLogs);

    return () => {
      unsubscribeMenusChannel();
      unsubscribeDailyLogsChannel();
    };
  }, []);

  useEffect(() => {
    if (menus.length > 0) {
      findMenu(menus, date);
    }
  }, [menus, date, selectedMealTime, selectedDiningHall]);

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    findMenu(menus, newDate);
    updateDailyLogForDate(newDate);
  };

  const updateDailyLogForDate = (date: Date) => {
    if (dailyLogs.length > 0 && user) {
      const existingDailyLog = dailyLogs.find(
        (dailyLog) =>
          dailyLog.uid === user.uid && printDate(new Date(dailyLog.date)) === printDate(date)
      );

      if (!existingDailyLog) {
        addDailyLog({
          uid: user.uid,
          date: printDate(date),
          calorieGoal: 0,
          foods: [],
        }).then((docId) => {
          setSelectedDailyLog({
            uid: user.uid,
            date: printDate(date),
            calorieGoal: 0,
            foods: [],
            docId,
          });
        });
      } else {
        setSelectedDailyLog(existingDailyLog);
      }
    }
  };

  const onLoadDailyLogs = (loadedDailyLogs: DailyLog[]) => {
    setDailyLogs(loadedDailyLogs);
    setIsLoading(false);
  };

  const onLoadMenus = (loadedMenus: Menu[]) => {
    setMenus(loadedMenus);
    findMenu(loadedMenus, date);
  };

  const findMenu = (loadedMenus: Menu[], date: Date) => {
    setSelectedMenu(
      loadedMenus.find(
        (menu) =>
          printDate(new Date(menu.date)) === printDate(date) &&
          menu.diningHall === selectedDiningHall &&
          menu.mealTime === selectedMealTime
      ) || null
    );
  };

  const selectMealTime = (mealTime: string) => {
    setSelectedMealTime(mealTime);
  };

  const selectDiningHall = (diningHall: DiningHall) => {
    setSelectedDiningHall(diningHall);
  };

  const addFoodToDailyLog = (food: Food, servingSize: number) => {
    if (!selectedDailyLog) return;

    const updatedFoods = [
      ...selectedDailyLog.foods,
      { ...food, servingSize: { ...food.servingSize, value: servingSize } },
    ];
    const updatedLog = { ...selectedDailyLog, foods: updatedFoods };

    setSelectedDailyLog(updatedLog);
    updateDailyLog(selectedDailyLog.docId, { foods: updatedFoods });
  };

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <div className="page">
      <DatePicker onDateChange={handleDateChange} />
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
          label="Breakfast"
          severity={selectedMealTime === "Breakfast" ? "danger" : "secondary"}
          onClick={() => selectMealTime("Breakfast")}
        />
        <Button
          label="Lunch"
          severity={selectedMealTime === "Lunch" ? "danger" : "secondary"}
          onClick={() => selectMealTime("Lunch")}
        />
        <Button
          label="Dinner"
          severity={selectedMealTime === "Dinner" ? "danger" : "secondary"}
          onClick={() => selectMealTime("Dinner")}
        />
      </div>
      <div className="page-menu">
        <h1 className="page-menu-section-title">Cucina</h1>
        <div className="page-menu-section-items">
          {selectedMenu && selectedDailyLog ? (
            selectedMenu.foods.map((item) => (
              <MenuItem
                key={item.docId}
                item={item}
                dailyLog={selectedDailyLog}
                addFood={addFoodToDailyLog}
              />
            ))
          ) : (
            <p>No menu available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
