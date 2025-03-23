import React, { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import MenuItem from "../components/MenuItem";
import DatePicker from "../components/DatePicker";
import UpArrowSvg from "./../assets/up-arrow.svg";
import DownArrowSvg from "./../assets/down-arrow.svg";
import { DailyLog, DiningHall, Food, Menu } from "../schema.type";
import { getMenus, unsubscribeMenusChannel } from "../services/menu.service";
import { capitalizeWords, getDateFromSessionStorage, printDate, timestamp } from "../util";
import {
  addDailyLog,
  getDailyLogs,
  unsubscribeDailyLogsChannel,
  updateDailyLog,
} from "../services/daily-log.service";

import "./../styles/Menu.scss";

const MenuPage: React.FC = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState<Date>(getDateFromSessionStorage());
  const [selectedDiningHall, setSelectedDiningHall] = useState<DiningHall>(DiningHall.STETSON_EAST);
  const [selectedMealTime, setSelectedMealTime] = useState<string>("Breakfast");
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [selectedDailyLog, setSelectedDailyLog] = useState<DailyLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string>(sessionStorage.getItem("userId"));

  const isInitialMount = useRef(true);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      getMenus(onLoadMenus);
      getDailyLogs(onLoadDailyLogs);
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

    const createdLogsMap = JSON.parse(sessionStorage.getItem("createdDailyLogs") || "{}");
    const userLogs = createdLogsMap[userId] || [];

    const updatedLogSet = new Set(userLogs);

    loadedDailyLogs.forEach((log) => {
      if (log.uid === userId) {
        const formattedDate = printDate(new Date(log.date));
        updatedLogSet.add(formattedDate);
      }
    });

    createdLogsMap[userId] = Array.from(updatedLogSet);
    sessionStorage.setItem("createdDailyLogs", JSON.stringify(createdLogsMap));
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
    const createdLogsMap = JSON.parse(sessionStorage.getItem("createdDailyLogs") || "{}");
    const createdLogs = createdLogsMap[userId] || [];

    const existingLog = dailyLogs.find(
      (log) => log.uid === userId && printDate(new Date(log.date)) === formattedDate
    );

    if (existingLog) {
      setSelectedDailyLog(existingLog);
      return;
    }

    if (createdLogs.includes(formattedDate)) {
      return;
    }

    if (formattedDate != "December 31, 1969") {
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
      createdLogsMap[userId] = createdLogs;
      sessionStorage.setItem("createdDailyLogs", JSON.stringify(createdLogsMap));
    }
  };

  const addFoodToDailyLog = (food: Food, servings: number) => {
    if (!selectedDailyLog) return;
    const currentTimestamp = timestamp();

    const updatedFoods = [
      ...selectedDailyLog.foods,
      {
        ...food,
        servings: servings,
        diningHall: selectedDiningHall,
        addedAt: currentTimestamp,
      },
    ];

    const updatedLog = { ...selectedDailyLog, foods: updatedFoods };

    setSelectedDailyLog(updatedLog);
    updateDailyLog(selectedDailyLog.docId, { foods: updatedFoods });
  };

  const toggleSection = (station: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [station]: !prev[station],
    }));
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
      <div className="page-timing">
        <h3 className="page-timing-title">8:00 AM to 10:00 PM</h3>
      </div>
      <div className="page-mealtime">
        {["Breakfast", "Lunch", "Dinner"].map((meal) => (
          <Button
            className={"page-mealtime-" + meal.toLowerCase()}
            key={meal}
            label={meal}
            severity={selectedMealTime === meal ? "danger" : "secondary"}
            onClick={() => setSelectedMealTime(meal)}
          />
        ))}
      </div>
      <div className="page-menu">
        {selectedMenu && selectedDailyLog ? (
          Object.entries(
            selectedMenu.foods.reduce((acc, food) => {
              (acc[food.foodStation] ||= []).push(food);
              return acc;
            }, {} as Record<string, Food[]>)
          )
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([station, foods]) => (
              <div key={station} className="page-menu-section">
                <div className="page-menu-section-header" onClick={() => toggleSection(station)}>
                  <h2 className="page-menu-section-header-title">{capitalizeWords(station)}</h2>
                  {expandedSections[station] ? (
                    <img
                      className="page-menu-section-header-arrow"
                      src={UpArrowSvg}
                      alt="Up Arrow SVG"
                    />
                  ) : (
                    <img
                      className="page-menu-section-header-arrow"
                      src={DownArrowSvg}
                      alt="Down Arrow SVG"
                    />
                  )}
                </div>
                {expandedSections[station] && (
                  <div className="page-menu-section-items">
                    {foods.map((item) => (
                      <MenuItem key={item.docId} item={item} addFood={addFoodToDailyLog} />
                    ))}
                  </div>
                )}
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
