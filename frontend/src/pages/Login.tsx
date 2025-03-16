import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
// import "./../styles/Login.scss";
import { Button } from "primereact/button";

const Login: React.FC = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const googleUser = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      setUser(googleUser);
      sessionStorage.setItem("userId", googleUser.uid);
      navigate("/menu");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="login-page">
      <h1>Login to Access Your Meal Log</h1>
      <Button label="Sign in with Google" severity="primary" onClick={handleLogin} />
    </div>
  );
};

export default Login;
