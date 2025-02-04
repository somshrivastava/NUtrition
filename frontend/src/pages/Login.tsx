import React, { useState, useEffect } from "react";
import {
  addUser,
  deleteUser,
  getUsersRealtime,
  unsubscribeUsersChannel,
  updateUser,
} from "../services/user.service";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Button } from "primereact/button";
import { useAuth } from "../hooks/useAuth";
import { searchInList, timestamp } from "../util";
import { NutritionUser } from "../schema.type";

const Login: React.FC = () => {
  const [users, setUsers] = useState<NutritionUser[]>([]);
  const { user, setUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const updateUserLastLoggedIn = () => {
    updateUser(user.uid, { lastLoggedIn: new Date().toLocaleTimeString() });
  };

  const deleteCurrentUser = () => {
    deleteUser(user.uid);
  };

  useEffect(() => {
    getUsersRealtime(setUsers);
    return () => {
      unsubscribeUsersChannel();
    };
  }, []);

  return (
    <>
      <div className="flex flex-column">
        <Button className="mb-3" label="Login" onClick={handleLogin} />
        {user ? `Logged in as ${user.displayName}` : "Not logged in"}
        <Button className="mt-3 mb-3" label="Logout" onClick={handleLogout} />
        <Button
          className="mt-3 mb-3"
          label="Update User Last Logged In"
          onClick={updateUserLastLoggedIn}
        />
        <Button className="mt-3 mb-3" label="Delete User" onClick={deleteCurrentUser} />
        {users.map((item, index) => (
          <div key={index}>
            {item.name} {item.lastLoggedIn}
          </div>
        ))}
      </div>
    </>
  );
};

export default Login;
