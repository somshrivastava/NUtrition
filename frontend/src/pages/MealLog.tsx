import React from "react";
import Date from "../components/Date"; 
import "../styles/MealLog.scss";
import { DailyLog, Food, Foods, FoodStation } from "../schema.type";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';


const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


const MealLog: React.FC = () => {

  const foods: Foods = {
    breakfast: [
      {
        name: "English Breakfast Baked Beans",
        description: "Traditional tomato baked beans with maple and spices",
        foodStation: FoodStation.CUCINA,
        nutritionalInfo: null,
        servingSize: {
          value: 1,
          unit: "cup",
        },
        dietaryRestrictions: [
          {
            symbol: "AG",
            name: "Avoiding Gluten",
            description: "Menu items made without gluten containing ingredients",
          },
          {
            symbol: "VG",
            name: "Vegan",
            description: "Contains no animal-based ingredients or by-products",
          },
        ],
      },
      {
        name: "English Breakfast Baked Beans",
        description: "Traditional tomato baked beans with maple and spices",
        foodStation: FoodStation.CUCINA,
        nutritionalInfo: null,
        servingSize: {
          value: 1,
          unit: "cup",
        },
        dietaryRestrictions: [
          {
            symbol: "AG",
            name: "Avoiding Gluten",
            description: "Menu items made without gluten containing ingredients",
          },
          {
            symbol: "VG",
            name: "Vegan",
            description: "Contains no animal-based ingredients or by-products",
          },
        ],
      },
      ],
      lunch: [],
      dinner: [],
      everyday: [],

  };
  
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}: any) => {
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


  const dailyLog: DailyLog =  { 
    uid: "Bob",
    date: "June 9th", 
    calorieGoal: 3000,
    foods: foods,
  }
  
  
  return (
    <>
      <Date/>
      <div className = "calorie-count">

        <h1>this is the calorie count "component" </h1>
        

      </div>
      <div className = "calorie-pie-chart">
      
    
      </div>

      <div className = "logged-meals">
          <div className="page-logged-meals-section">
            <h1 className="page-logged-meals-section-title">Logged Meals</h1>
            <div className="page-logged-meals-section-items">
            
                <div className="page-logged-meals-section-item">
                  <div className="page-logged-meals-section-item-content">
                    <h3 className="page-logged-meals-section-item-content-title">
                      English Breakfast Baked Beans (PR) (AG)
                    </h3>
                    <p className="page-menu-section-item-content-description">
                      Traditional tomato baked beans with maple and spices{" "}
                    </p>
                  </div>
                </div>
              
            </div>
          </div>
        </div>
    </>
  ); 
  
  


export default MealLog;

export default class Example extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/pie-chart-with-customized-label-dlhhj';

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
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
      </ResponsiveContainer>
    );
  }
}
