import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import MealLog from "./pages/MealLog";
import History from "./pages/History";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/meal-log" element={<MealLog />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
