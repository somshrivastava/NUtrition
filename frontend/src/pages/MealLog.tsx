import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Menu.scss";
import "./../styles/MealLog.scss";
import MacrosChart from "../components/MacrosChart";
import Legend from "../components/Legend";
import Meals from "../components/Meals";
import DatePicker from "../components/DatePicker";
import { getDailyLogs, updateDailyLog } from "../services/daily-log.service";
import { DailyLog, Food } from "../schema.type";
import { useAuth } from "../hooks/useAuth";
import { printDate, getDate } from "../util";

const MealLog: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(getDate());
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [selectedDailyLog, setSelectedDailyLog] = useState<DailyLog | null>(null);
  const [calorieGoal, setCalorieGoal] = useState<number>(2000);

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (userId) {
      getDailyLogs(onLoadDailyLogs, () => {});
    } else {
      setDailyLogs([]);
      setSelectedDailyLog(null);
    }
  }, [userId]);

  useEffect(() => {
    if (dailyLogs.length > 0) {
      findSelectedDailyLog();
    }
  }, [dailyLogs, date]);

  const onLoadDailyLogs = (loadedDailyLogs: DailyLog[]) => {
    setDailyLogs(loadedDailyLogs);
    findSelectedDailyLog(loadedDailyLogs);
  };

  const findSelectedDailyLog = (logs = dailyLogs) => {
    if (!userId) return;
    const formattedDate = printDate(date);
    const userLog = logs.find(
      (log) => log.uid === userId && printDate(new Date(log.date)) === formattedDate
    );
    setSelectedDailyLog(userLog || null);
    if (userLog?.calorieGoal) {
      setCalorieGoal(userLog.calorieGoal);
    }
  };

  return userId ? (
    <div className="page">
      <DatePicker onDateChange={setDate} />
      <MacrosChart carbohydrates={20} protein={30} fat={50} />
      <Legend />
      {selectedDailyLog?.foods.length ? (
        <Meals title="Logged Meals" meals={selectedDailyLog.foods} />
      ) : (
        <p>No meals logged.</p>
      )}
    </div>
  ) : null;
};

export default MealLog;
