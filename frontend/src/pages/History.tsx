import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import "./../styles/History.scss";
import Legend from "./../components/Legend";
import { Dropdown } from "primereact/dropdown";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDailyLogs } from "../services/daily-log.service";
import { DailyLog } from "../schema.type";
import { printDate } from "../util";

const History: React.FC = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");

  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("Today");
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const [selectedMacro, setSelectedMacro] = useState<string>("calories"); // ✅ Default: Calories

  // ✅ Set fixed base date (February 24th, 2025)
  const baseDate = new Date(2025, 1, 24); // February 24th, 2025

  const TimeOptions = [{ time: "Today" }, { time: "Past 3 Days" }, { time: "Past 7 Days" }];
  const MacroOptions = [
    { name: "Calories", value: "calories", color: "#ff7300" }, // Orange
    { name: "Protein", value: "protein", color: "#82ca9d" }, // Green
    { name: "Carbs", value: "carbs", color: "#8884d8" }, // Blue
    { name: "Fat", value: "fat", color: "#ff0000" }, // Red
  ];

  // ✅ Redirect if user is not logged in
  useEffect(() => {
    if (!userId) {
      navigate("/");
    } else {
      getDailyLogs(onLoadDailyLogs, () => {});
    }
  }, [userId]);

  // ✅ Recalculate graph data when logs OR selectedTime changes
  useEffect(() => {
    updateGraphData(selectedTime, dailyLogs);
  }, [selectedTime, dailyLogs]); // ✅ Runs every time selectedTime changes

  // ✅ Load daily logs
  const onLoadDailyLogs = (logs: DailyLog[]) => {
    setDailyLogs(logs);
    updateGraphData(selectedTime, logs);
  };

  // ✅ Ensure only numbers are used in calculations
  const toNumber = (value: any): number => {
    return typeof value === "number" && !isNaN(value) ? value : 0;
  };

  // ✅ Generate graph data based on selected time range from February 24th
  const updateGraphData = (timeRange: string, logs: DailyLog[]) => {
    let filteredLogs = [];

    if (timeRange === "Today") {
      filteredLogs = logs.filter((log) => printDate(new Date(log.date)) === printDate(baseDate));
    } else if (timeRange === "Past 3 Days") {
      const past3Days = new Date(baseDate);
      past3Days.setDate(baseDate.getDate() - 3);
      filteredLogs = logs.filter((log) => new Date(log.date) >= past3Days);
    } else if (timeRange === "Past 7 Days") {
      const past7Days = new Date(baseDate);
      past7Days.setDate(baseDate.getDate() - 7);
      filteredLogs = logs.filter((log) => new Date(log.date) >= past7Days);
    }

    // ✅ Aggregate data for graph (ensuring only numbers are used)
    const graphData = filteredLogs.map((log) => ({
      name: printDate(new Date(log.date)), // Format date as label
      calories: log.foods.reduce(
        (sum, food) =>
          sum + toNumber(food.nutritionalInfo.calories.value) * toNumber(food.servingSize.value),
        0
      ),
      protein: log.foods.reduce(
        (sum, food) =>
          sum + toNumber(food.nutritionalInfo.protein.value) * toNumber(food.servingSize.value),
        0
      ),
      carbs: log.foods.reduce(
        (sum, food) =>
          sum +
          toNumber(food.nutritionalInfo.carbohydrates.value) * toNumber(food.servingSize.value),
        0
      ),
      fat: log.foods.reduce(
        (sum, food) =>
          sum + toNumber(food.nutritionalInfo.fat.value) * toNumber(food.servingSize.value),
        0
      ),
    }));

    setSelectedData(graphData);
  };

  // ✅ Find the selected macro's color
  const selectedMacroColor =
    MacroOptions.find((option) => option.value === selectedMacro)?.color || "#ff7300";

  return (
    <div className="page">
      {/* ✅ First Dropdown for Time Range Selection */}
      <div className="page-history-time">
        <Dropdown
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.value.time)}
          options={TimeOptions}
          optionLabel="time"
          placeholder="Select Time Range"
        />
      </div>

      {/* ✅ Second Dropdown for Macro Selection */}
      <div className="page-history-macro">
        <Dropdown
          value={selectedMacro}
          onChange={(e) => setSelectedMacro(e.value.value)}
          options={MacroOptions}
          optionLabel="name"
          placeholder="Select Macro to View"
        />
      </div>

      {/* ✅ Line Graph for Selected Macro */}
      <div className="page-line-graph">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            width={500}
            height={350}
            data={selectedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={selectedMacro}
              stroke={selectedMacroColor}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Legend />

      {/* ✅ Display macros for the selected range */}
      {selectedData.length > 0 ? (
        <div className="page-macros">
          <div className="page-macros-row">
            <Button
              className="page-macros-calories"
              label={`Calories: ${selectedData.reduce(
                (sum, day) => sum + toNumber(day.calories),
                0
              )} cal`}
              severity="danger"
            />
            <Button
              className="page-macros-carbohydrates"
              label={`Carbs: ${selectedData.reduce((sum, day) => sum + toNumber(day.carbs), 0)}g`}
            />
          </div>
          <div className="page-macros-row">
            <Button
              className="page-macros-protein"
              label={`Protein: ${selectedData.reduce(
                (sum, day) => sum + toNumber(day.protein),
                0
              )}g`}
            />
            <Button
              className="page-macros-fat"
              label={`Fat: ${selectedData.reduce((sum, day) => sum + toNumber(day.fat), 0)}g`}
            />
          </div>
        </div>
      ) : (
        <p>No data available for the selected range.</p>
      )}
    </div>
  );
};

export default History;
