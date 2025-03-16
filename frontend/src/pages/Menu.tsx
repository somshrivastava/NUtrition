import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Menu.scss";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DailyLog, DiningHall, Food, Menu } from "../schema.type";
import DatePicker from "../components/DatePicker";
import { getMenus, unsubscribeMenusChannel } from "../services/menu.service";
import {
  getDailyLogs,
  addDailyLog,
  updateDailyLog,
  unsubscribeDailyLogsChannel,
} from "../services/daily-log.service";
import { printDate, getDate, timestamp } from "../util";
import MenuItem from "../components/MenuItem";

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(getDate());
  const [selectedDiningHall, setSelectedDiningHall] = useState<DiningHall>(
    DiningHall.INTERNATIONAL_VILLAGE
  );
  const [selectedMealTime, setSelectedMealTime] = useState<string>("Breakfast");
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [selectedDailyLog, setSelectedDailyLog] = useState<DailyLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [userId, setUserId] = useState<string>(sessionStorage.getItem("userId"));
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      getMenus(onLoadMenus, () => {});
      getDailyLogs(onLoadDailyLogs, () => {});
    } else {
      setMenus([]);
      setDailyLogs([]);
      setSelectedDailyLog(null);
    }
    return () => {
      unsubscribeMenusChannel();
      unsubscribeDailyLogsChannel();
    };
  }, [userId]);

  useEffect(() => {
    findMenu();
  }, [menus, date, selectedDiningHall, selectedMealTime]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (userId) {
        updateDailyLogForUser();
      } else {
        setSelectedDailyLog(null);
      }
    }
  }, [date]);

  const onLoadMenus = (loadedMenus: Menu[]) => {
    setMenus(loadedMenus);
    setIsLoading(false);
    findMenu();
  };

  const onLoadDailyLogs = (loadedDailyLogs: DailyLog[]) => {
    setDailyLogs(loadedDailyLogs);
    setIsLoading(false);
  };

  const findMenu = () => {
    const menu = menus.find(
      (menu) =>
        printDate(new Date(menu.date)) === printDate(date) &&
        menu.diningHall === selectedDiningHall &&
        menu.mealTime === selectedMealTime
    );
    setSelectedMenu(menu || null);
  };

  const updateDailyLogForUser = async () => {
    if (!userId) return;

    const formattedDate = printDate(date);
    const createdLogs = JSON.parse(sessionStorage.getItem("createdDailyLogs") || "[]");

    const existingLog = dailyLogs.find(
      (log) => log.uid === userId && printDate(new Date(log.date)) === formattedDate
    );

    if (existingLog) {
      setSelectedDailyLog(existingLog);
      return;
    }

    if (createdLogs.includes(formattedDate)) {
      console.log(`Log for ${formattedDate} already tracked in sessionStorage.`);
      return;
    }

    const docId = await addDailyLog({
      uid: userId,
      date: formattedDate,
      calorieGoal: 2500,
      foods: [],
    });

    const newLog = { uid: userId, date: formattedDate, calorieGoal: 0, foods: [], docId };
    setSelectedDailyLog(newLog);
    setDailyLogs((prevLogs) => [...prevLogs, newLog]);

    createdLogs.push(formattedDate);
    sessionStorage.setItem("createdDailyLogs", JSON.stringify(createdLogs));
  };

  const addFoodToDailyLog = (food: Food, servingSize: number) => {
    if (!selectedDailyLog) return;

    const currentTimestamp = timestamp();

    const updatedFoods = [
      ...selectedDailyLog.foods,
      {
        ...food,
        servingSize: { ...food.servingSize, value: servingSize },
        diningHall: selectedDiningHall,
        addedAt: currentTimestamp,
      },
    ];

    const updatedLog = { ...selectedDailyLog, foods: updatedFoods };

    setSelectedDailyLog(updatedLog);
    updateDailyLog(selectedDailyLog.docId, { foods: updatedFoods });
  };

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <div className="page">
      <DatePicker onDateChange={setDate} />
      <div className="page-dining-hall">
        <Dropdown
          value={selectedDiningHall}
          onChange={(e) => setSelectedDiningHall(e.value)}
          options={Object.values(DiningHall)}
          optionLabel="name"
          placeholder="Select a Dining Hall"
        />
      </div>
      <div className="page-mealtime">
        {["Breakfast", "Lunch", "Dinner"].map((meal) => (
          <Button
            key={meal}
            label={meal}
            severity={selectedMealTime === meal ? "danger" : "secondary"}
            onClick={() => setSelectedMealTime(meal)}
          />
        ))}
      </div>
      <div className="page-menu">
        <h1 className="page-menu-section-title">Menu</h1>
        {selectedMenu && selectedDailyLog ? (
          Object.entries(
            selectedMenu.foods.reduce((acc, food) => {
              (acc[food.foodStation] ||= []).push(food);
              return acc;
            }, {} as Record<string, Food[]>)
          ).map(([station, foods]) => (
            <div key={station} className="page-menu-section">
              <h2 className="page-menu-section-title">{station}</h2>
              <div className="page-menu-section-items">
                {foods.map((item) => (
                  <MenuItem key={item.docId} item={item} addFood={addFoodToDailyLog} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No menu available</p>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
