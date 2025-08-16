import React from "react";
import "./Header.css";
import logo from "../logo.png"; // adjust the path if logo.png is directly in src

const Header = () => {
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
          <div className="auth-buttons">
            <button className="btn btn-secondary">Customer Login</button>
            <button className="btn btn-primary">Employee Login</button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
