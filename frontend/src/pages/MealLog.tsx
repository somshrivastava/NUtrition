import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Menu.scss";
import "./../styles/MealLog.scss";
import MacrosChart from "../components/MacrosChart";
import Legend from "../components/Legend";
import Meals from "../components/Meals";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
import DatePicker from "../components/DatePicker";
import { getDailyLogs, updateDailyLog } from "../services/daily-log.service";
import { DailyLog, Food } from "../schema.type";
import { printDate, getDate } from "../util";

const MealLog: React.FC = () => {
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

  // ✅ Handle calorie goal input change & update in database
  const handleCalorieGoalChange = (value: string) => {
    const newGoal = parseInt(value, 10) || 0;
    setCalorieGoal(newGoal);

    if (selectedDailyLog) {
      updateDailyLog(selectedDailyLog.docId, { calorieGoal: newGoal });
    }
  };

  // ✅ Delete a meal from daily log
  const handleDeleteFood = (foodIndex: number) => {
    if (!selectedDailyLog) return;

    const updatedFoods = selectedDailyLog.foods.filter((_, index) => index !== foodIndex);
    const updatedLog = { ...selectedDailyLog, foods: updatedFoods };

    setSelectedDailyLog(updatedLog);
    updateDailyLog(selectedDailyLog.docId, { foods: updatedFoods });
  };

  // ✅ Edit serving size of a meal
  const handleEditFoodServing = (foodIndex: number, newServingSize: number) => {
    if (!selectedDailyLog) return;

    const updatedFoods = selectedDailyLog.foods.map((food, index) =>
      index === foodIndex
        ? { ...food, servingSize: { ...food.servingSize, value: newServingSize } }
        : food
    );

    const updatedLog = { ...selectedDailyLog, foods: updatedFoods };

    setSelectedDailyLog(updatedLog);
    updateDailyLog(selectedDailyLog.docId, { foods: updatedFoods });
  };

  // ✅ Calculate total macros dynamically
  const calculateMacros = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    if (selectedDailyLog?.foods) {
      selectedDailyLog.foods.forEach((food: Food) => {
        totalCalories += food.nutritionalInfo.calories.value * (food.servingSize.value || 1);
        totalProtein += food.nutritionalInfo.protein.value * (food.servingSize.value || 1);
        totalCarbs += food.nutritionalInfo.carbohydrates.value * (food.servingSize.value || 1);
        totalFat += food.nutritionalInfo.fat.value * (food.servingSize.value || 1);
      });
    }

    return { totalCalories, totalProtein, totalCarbs, totalFat };
  };

  // ✅ Get calculated macro values
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
            value={calorieGoal}
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
      <MacrosChart carbohydrates={totalCarbs} protein={totalProtein} fat={totalFat} />
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
