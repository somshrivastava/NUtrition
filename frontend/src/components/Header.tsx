import React, { useRef, useState } from "react";
import LogoSvg from "./../assets/logo.svg";
import HamburgerSvg from "./../assets/hamburger.svg";
import "./../styles/Header.scss";
import { Menu } from "primereact/menu";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { searchInList, timestamp } from "../util";
import { auth } from "../firebase";
import { NutritionUser } from "../schema.type";
import { addUser } from "../services/user.service";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<NutritionUser[]>([]);
  const { user, setUser } = useAuth();
  const menuRef = useRef(null);
  const menu = [
    { label: "Menu", command: () => navigate("/menu") },
    { label: "Meal Log", command: () => navigate("/meal-log") },
    { label: "History", command: () => navigate("/history") },
    {
      label: (
        <>
          {user ? (
            <div className="header-logout">
              <span>Logout</span>
              <img className="header-logout-pfp" src={user.photoURL} alt={user.displayName} />
              {}
            </div>
          ) : (
            "Login"
          )}
        </>
      ),
      command: () => {
        if (user) {
          handleLogout();
        } else {
          handleLogin();
        }
      },
    },
  ];

  const handleLogin = async () => {
    try {
      const googleUser = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      if (googleUser.email.includes(".husky.neu.edu")) {
        const searchedUser = searchInList(users, "uid", googleUser.uid) as NutritionUser;
        if (!searchedUser) {
          let newUser = {
            uid: googleUser.uid,
            name: googleUser.displayName,
            pfp: googleUser.photoURL,
            lastLoggedIn: new Date().toLocaleTimeString(),
          } as NutritionUser;
          addUser(newUser);
        }
        console.log(timestamp(), "| Logged in user:", searchedUser ? searchedUser : user);
      } else {
        throw new Error("Not a Northeastern email");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log(timestamp(), "| Logged out user");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
