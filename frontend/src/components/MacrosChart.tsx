import React from "react";

import { Pie } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";

import "./../styles/MacrosChart.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

interface InputProps {
  carbs: number;
  fat: number;
  protein: number;
}

const MacrosChart: React.FC<InputProps> = ({ carbs, fat, protein }) => {
  const total = carbs + fat + protein;

  const data = {
    labels: ["Carbohydrates", "Fat", "Protein"],
    datasets: [
      {
        label: "% of Macros",
        data: [carbs, fat, protein],
        backgroundColor: ["#14B8A6", "#FACC15", "#6D71F9"],
        borderColor: ["#14B8A6", "#FACC15", "#6D71F9"],
        borderWidth: 1,
      },
    ],
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: false,
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(0);
            return `${context.label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <div className="page-container">
      <div className="page-container-chart">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default MacrosChart;
