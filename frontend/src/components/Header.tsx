import React, { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router";

import { Menu } from "primereact/menu";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

import { auth } from "../firebase";
import LogoSvg from "./../assets/logo.svg";
import { useAuth } from "../hooks/useAuth";
import { NutritionUser } from "../schema.type";
import { searchInList, timestamp } from "../util";
import HamburgerSvg from "./../assets/hamburger.svg";
import { addUser, getUsersRealtime, unsubscribeUsersChannel } from "../services/user.service";

import "./../styles/Header.scss";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const { user, setUser } = useAuth();
  const [users, setUsers] = useState<NutritionUser[]>([]);

  const menuToggle = useRef(null);
  const menu: any = [
    { label: "Menu", command: () => navigate("/menu") },
    { label: "Meal Log", command: () => navigate("/meal-log") },
    { label: "History", command: () => navigate("/history") },
    { label: "Feedback", command: () => navigate("/feedback") },
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

  useEffect(() => {
    // get users
    getUsersRealtime(setUsers);
    // unsubscribe to users channel once component is destroyed
    return () => {
      unsubscribeUsersChannel();
    };
  }, []);

  // login with google
  const handleLogin = async () => {
    try {
      const googleUser = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      // search for the  user within the list of users in the database
      const searchedUser = searchInList(users, "uid", googleUser.uid) as NutritionUser;
      // adds the user if they are  not in the database
      if (!searchedUser) {
        let newUser = {
          uid: googleUser.uid,
          name: googleUser.displayName,
          pfp: googleUser.photoURL,
          lastLoggedIn: new Date().toLocaleTimeString(),
        } as Omit<NutritionUser, "docId">;
        addUser(newUser);
      }
      console.log(timestamp(), "| Logged in user:", searchedUser ? searchedUser : user);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  // logout with google
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      sessionStorage.removeItem("userId");
      navigate("/");
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
          onClick={(event) => menuToggle.current.toggle(event)}
        />
        <Menu model={menu} ref={menuToggle} popup id="popup_menu_right" popupAlignment="right" />
      </div>
    </>
  );
};

export default Header;
