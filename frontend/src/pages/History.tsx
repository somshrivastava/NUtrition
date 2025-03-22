import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import "./../styles/History.scss";
import Legend from "./../components/Legend";
import { Dropdown } from "primereact/dropdown";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend as ChartLegend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getDailyLogs } from "../services/daily-log.service";
import { DailyLog } from "../schema.type";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ChartLegend
);

const History: React.FC = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");

  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("Past 3 Days");
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const [selectedMacro, setSelectedMacro] = useState<string>("calories");
  const [macroDisplayType, setMacroDisplayType] = useState<"Total" | "Average">("Total");

  // const baseDate = new Date(2025, 1, 23);
  const baseDate = new Date();

  const TimeOptions = ["Past 3 Days", "Past 7 Days"];
  const MacroOptions = [
    { name: "Calories", value: "calories", color: "#c4a484" },
    { name: "Protein", value: "protein", color: "#facc15" },
    { name: "Carbs", value: "carbs", color: "#14b8a6" },
    { name: "Fat", value: "fat", color: "#6d71f9" },
  ];
  const MacroDisplayOptions = ["Total", "Average"];

  useEffect(() => {
    if (!userId) {
      navigate("/");
    } else {
      getDailyLogs(onLoadDailyLogs, () => {});
    }
  }, [userId]);

  useEffect(() => {
    updateGraphData(selectedTime, dailyLogs);
  }, [selectedTime, dailyLogs]);

  const onLoadDailyLogs = (logs: DailyLog[]) => {
    setDailyLogs(logs);
    updateGraphData(selectedTime, logs);
  };

  const toNumber = (value: any): number => {
    return typeof value === "number" && !isNaN(value) ? value : 0;
  };

  const updateGraphData = (timeRange: string, logs: DailyLog[]) => {
    let filteredLogs = logs.filter((log) => log.uid == userId);

    if (timeRange === "Past 3 Days") {
      const past3Days = new Date(baseDate);
      past3Days.setDate(baseDate.getDate() - 3);
      filteredLogs = filteredLogs.filter(
        (log) => new Date(log.date) > past3Days && new Date(log.date) <= baseDate
      );
    } else if (timeRange === "Past 7 Days") {
      const past7Days = new Date(baseDate);
      past7Days.setDate(baseDate.getDate() - 7);
      filteredLogs = filteredLogs.filter(
        (log) => new Date(log.date) > past7Days && new Date(log.date) <= baseDate
      );
    }
    const graphData = filteredLogs
      .map((log) => {
        const date = new Date(log.date);
        return {
          rawDate: date,
          name: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          calories: log.foods.reduce(
            (sum, food) =>
              sum +
              toNumber(food.nutritionalInfo.calories.value) * toNumber(food.servingSize.value),
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
        };
      })
      .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime())
      .map(({ rawDate, ...rest }) => rest);

    setSelectedData(graphData);
  };

  const numberOfDays = selectedData.length;
  const averageMacros = {
    calories:
      numberOfDays > 0
        ? Math.round(
            selectedData.reduce((sum, day) => sum + toNumber(day.calories), 0) / numberOfDays
          )
        : 0,
    protein:
      numberOfDays > 0
        ? Math.round(
            selectedData.reduce((sum, day) => sum + toNumber(day.protein), 0) / numberOfDays
          )
        : 0,
    carbs:
      numberOfDays > 0
        ? Math.round(selectedData.reduce((sum, day) => sum + toNumber(day.carbs), 0) / numberOfDays)
        : 0,
    fat:
      numberOfDays > 0
        ? Math.round(selectedData.reduce((sum, day) => sum + toNumber(day.fat), 0) / numberOfDays)
        : 0,
  };

  const chartLabels = selectedData.map((entry) => entry.name);
  const chartValues = selectedData.map((entry) => entry[selectedMacro]);
  const selectedMacroColor =
    MacroOptions.find((option) => option.value === selectedMacro)?.color || "#ff7300";

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: selectedMacro.charAt(0).toUpperCase() + selectedMacro.slice(1),
        data: chartValues,
        borderColor: selectedMacroColor,
        backgroundColor: selectedMacroColor,
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: false,
      title: {
        display: true,
        text: `Daily ${selectedMacro.charAt(0).toUpperCase() + selectedMacro.slice(1)}`,
      },
    },
  };

  return (
    <div className="page">
      <div className="page-options">
        <div className="page-options-option">
          <Dropdown
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.value)}
            options={TimeOptions}
            placeholder="Select Time Range"
          />
        </div>
        <div className="page-options-option">
          <Dropdown
            value={selectedMacro}
            onChange={(e) => setSelectedMacro(e.value)}
            options={MacroOptions}
            optionLabel="name"
            placeholder="Select Macro"
          />
        </div>
      </div>

      <div className="page-line-graph">
        <div style={{ height: "100%", width: "100%" }}>
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>

      <Legend />

      {selectedData.length > 0 ? (
        <>
          <div className="page-macros">
            <div className="page-macros-toggle">
              <Dropdown
                value={macroDisplayType}
                onChange={(e) => setMacroDisplayType(e.value)}
                options={MacroDisplayOptions}
                placeholder="Select Display"
              />
            </div>

            {macroDisplayType === "Total" ? (
              <>
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
                    label={`Carbs: ${selectedData.reduce(
                      (sum, day) => sum + toNumber(day.carbs),
                      0
                    )}g`}
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
              </>
            ) : (
              <>
                <div className="page-macros-row">
                  <Button
                    className="page-macros-calories"
                    label={`Calories: ${averageMacros.calories} cal`}
                    severity="danger"
                  />
                  <Button
                    className="page-macros-carbohydrates"
                    label={`Carbs: ${averageMacros.carbs}g`}
                  />
                </div>
                <div className="page-macros-row">
                  <Button
                    className="page-macros-protein"
                    label={`Protein: ${averageMacros.protein}g`}
                  />
                  <Button className="page-macros-fat" label={`Fat: ${averageMacros.fat}g`} />
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <p>No data available for the selected range.</p>
      )}
    </div>
  );
};

export default History;
