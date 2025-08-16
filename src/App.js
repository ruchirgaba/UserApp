import React from "react";
import "./App.css";
// Previous page components (commented out)
// import Header from "./components/Header";
// import Hero from "./components/Hero";
// import LoansSection from "./components/LoansSection";
// import AboutSection from "./components/AboutSection";
// import ContactSection from "./components/ContactSection";
// import Footer from "./components/Footer";

// LoggedIn page component
import AppLoggedIn from "./components/LoggedIn/AppLoggedIn";
// UserApplication component
import LoanApplicationForm from "./components/UserApplication/LoanApplicationForm";

function App() {
  return (
    <div className="App">
      {/* Previous page (commented out) */}
      {/* <Header />
      <Hero />
      <LoansSection />
      <AboutSection />
      <ContactSection />
      <Footer /> */}
      
      {/* LoggedIn page (commented out) */}
      {/* <AppLoggedIn /> */}
      
      {/* UserApplication Form */}
      <LoanApplicationForm />
    </div>
  );
}

export default App;
