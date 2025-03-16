import "./App.scss";
import "primereact/resources/themes/lara-dark-blue/theme.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Header from "./components/Header";
import Menu from "./pages/Menu";
import MealLog from "./pages/MealLog";
import History from "./pages/History";
import Feedback from "./pages/Feedback";
import Login from "./pages/Login";

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
