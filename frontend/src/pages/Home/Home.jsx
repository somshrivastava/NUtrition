import { useState } from "react";
import "./Home.css";
import Footer from "../../components/Footer.jsx";
import TopNav from "../../components/TopNav.jsx";

const Home = () => {
  return (
    <>
      <TopNav />
      <p>home page</p>
      <Footer />
    </>
  );
};

export default Home;
