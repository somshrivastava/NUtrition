import React from "react";

import { BrowserRouter, Route, Routes } from "react-router";

import Menu from "./pages/Menu";
import Login from "./pages/Login";
import MealLog from "./pages/MealLog";
import History from "./pages/History";
import Feedback from "./pages/Feedback";
import Header from "./components/Header";

import "primereact/resources/themes/lara-dark-blue/theme.css";

import "./App.scss";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/meal-log" element={<MealLog />} />
          <Route path="/history" element={<History />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
