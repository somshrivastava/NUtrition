import React, { useRef } from "react";
import LogoSvg from "./../assets/logo.svg";
import HamburgerSvg from "./../assets/hamburger.svg";
import "./../styles/Header.scss";
import { Menu } from "primereact/menu";
import { useNavigate } from "react-router";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const menu = [
    { label: "Login", command: () => navigate("/login") },
    { label: "Menu", command: () => navigate("/menu") },
    { label: "Meal Log", command: () => navigate("/meal-log") },
    { label: "History", command: () => navigate("/history") },
  ];

  return (
    <>
      <div className="header">
        <img
          className="header-logo"
          src={LogoSvg}
          alt="NUtrition Logo"
          onClick={() => navigate("/menu")}
        />
        <img
          className="header-menu"
          src={HamburgerSvg}
          alt="Hamburger Icon"
          onClick={(event) => menuRef.current.toggle(event)}
        />
        <Menu model={menu} ref={menuRef} popup id="popup_menu_right" popupAlignment="right" />
      </div>
    </>
  );
};

export default Header;
