import React from "react";
import "./HeaderLoggedIn.css";
import logo from "../../logo.png";

const HeaderLoggedIn = () => {
  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <div className="logo">
            <img src={logo} alt="Standard Chartered" className="logo-img" />
          </div>
          <ul className="nav-links">
            <li>
              <a href="#banking">Online Banking</a>
            </li>
            <li>
              <a href="#services">Digital Services</a>
            </li>
            <li>
              <a href="#info">Important Information</a>
            </li>
            <li>
              <a href="#account">Investment Account</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
          <div className="user-section">
            <div className="notification-bell">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="notification-dot"></span>
            </div>
            <button className="btn btn-logged-in">
              Hey User
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default HeaderLoggedIn;
