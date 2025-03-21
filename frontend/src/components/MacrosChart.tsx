import React from "react";
import { PieChart, Pie, Cell } from "recharts";

interface InputProps {
  carbohydrates: number;
  fat: number;
  protein: number;
}

const MacrosChart: React.FC<InputProps> = ({ carbohydrates, fat, protein }) => {
  const total = carbohydrates + fat + protein;
  console.log(carbohydrates, fat, protein);
  const data = [
    { name: "Carbohydrates", value: carbohydrates / total },
    { name: "Fat", value: fat / total },
    { name: "Protein", value: protein / total },
  ];

  const COLORS = ["#14B8A6", "#FACC15", "#6D71F9"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <>
      <div className="page-chart">
        <PieChart width={200} height={200}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>
    </>
  );
};

export default MacrosChart;
