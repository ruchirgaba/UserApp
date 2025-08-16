import React from "react";
import "./AppLoggedIn.css";
import HeaderLoggedIn from "./HeaderLoggedIn";
import HeroLoggedIn from "./HeroLoggedIn";
import LoansSection from "./LoansSection";
import AboutSection from "./AboutSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";

function AppLoggedIn() {
  return (
    <div className="App">
      <HeaderLoggedIn />
      <HeroLoggedIn />
      <LoansSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default AppLoggedIn;
