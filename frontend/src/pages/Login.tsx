import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import "./../styles/Login.scss";

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
    <div className="page">
      <div className="page-login-container">
        <Button label="Sign in with Google" severity="danger" onClick={handleLogin} />
      </div>
    </div>
  );
};

export default Login;
