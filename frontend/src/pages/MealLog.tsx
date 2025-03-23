import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";

import Meals from "../components/Meals";
import Legend from "../components/Legend";
import { DailyLog, Food } from "../schema.type";
import DatePicker from "../components/DatePicker";
import MacrosChart from "../components/MacrosChart";
import { getDateFromSessionStorage, printDate } from "../util";
import { getDailyLogs, updateDailyLog } from "../services/daily-log.service";

import "./../styles/Menu.scss";
import "./../styles/MealLog.scss";

const MealLog: React.FC = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState<Date>(getDateFromSessionStorage());
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
      getDailyLogs(onLoadDailyLogs);
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

  const handleCalorieGoalChange = (value: string) => {
    const newGoal = parseInt(value, 10) || 0;
    setCalorieGoal(newGoal);

    if (selectedDailyLog) {
      updateDailyLog(selectedDailyLog.docId, { calorieGoal: newGoal });
    }
  };

  const handleDeleteFood = (foodIndex: number) => {
    if (!selectedDailyLog) return;

    const updatedFoods = selectedDailyLog.foods.filter((food, index) => index !== foodIndex);
    const updatedLog = { ...selectedDailyLog, foods: updatedFoods };

    setSelectedDailyLog(updatedLog);
    updateDailyLog(selectedDailyLog.docId, { foods: updatedFoods });
  };

  const handleEditFoodServing = (foodIndex: number, newServingSize: number) => {
    if (!selectedDailyLog) return;

    const updatedFoods = selectedDailyLog.foods.map((food, index) =>
      index === foodIndex ? { ...food, servings: newServingSize } : food
    );

    const updatedLog = { ...selectedDailyLog, foods: updatedFoods };

    setSelectedDailyLog(updatedLog);
    updateDailyLog(selectedDailyLog.docId, { foods: updatedFoods });
  };

  const calculateMacros = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    if (selectedDailyLog?.foods) {
      selectedDailyLog.foods.forEach((food: Food) => {
        totalCalories += food.nutritionalInfo.calories.value * (food.servings || 1);
        totalProtein += food.nutritionalInfo.protein.value * (food.servings || 1);
        totalCarbs += food.nutritionalInfo.carbohydrates.value * (food.servings || 1);
        totalFat += food.nutritionalInfo.fat.value * (food.servings || 1);
      });
    }

    return { totalCalories, totalProtein, totalCarbs, totalFat };
  };

  const { totalCalories, totalProtein, totalCarbs, totalFat } = calculateMacros();

  const valueTemplate = () => {
    return (
      <React.Fragment>
        {Math.round((totalCalories / calorieGoal + Number.EPSILON) * 100)}%
      </React.Fragment>
    );
  };

  return userId ? (
    <div className="page">
      <DatePicker onDateChange={setDate} />
      <div className="page-calories">
        <div className="page-calories-value">
          <div className="page-calories-value-consumed">{totalCalories} / </div>
          <InputText
            className="page-calories-value-goal"
            keyfilter="int"
            placeholder=""
            value={calorieGoal.toString()}
            onChange={(e) => handleCalorieGoalChange(e.target.value)}
          />
          <div className="page-calories-value-units">cals</div>
        </div>
        <ProgressBar
          className="page-calories-bar"
          value={(totalCalories / calorieGoal) * 100}
          displayValueTemplate={valueTemplate}
        ></ProgressBar>
      </div>
      <MacrosChart carbs={totalCarbs} protein={totalProtein} fat={totalFat} />
      <Legend />
      {selectedDailyLog?.foods.length ? (
        <Meals
          title="Logged Meals"
          meals={selectedDailyLog.foods}
          onDelete={handleDeleteFood}
          onEdit={handleEditFoodServing}
        />
      ) : (
        <p>No meals logged.</p>
      )}
    </div>
  ) : null;
};

export default MealLog;
