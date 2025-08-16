import React from "react";
import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";
import logo from "../../logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Left side: logo + links */}
      <div className="footer-left">
        <img src={logo} alt="Standard Chartered" className="footer-logo-img" />
        <div className="footer-links">
          <div className="footer-column">
            <a href="#">Accessibility</a>
            <a href="#">Cookie policy</a>
            <a href="#">Terms of use</a>
            <a href="#">Privacy policy</a>
            <a href="#">Modern slavery statement</a>
            <a href="#">Regulatory disclosures</a>
            <a href="#">Straight2Bank onboarding portal</a>
            <a href="#">Our Code of Conduct and Ethics</a>
          </div>
          <div className="footer-column">
            <a href="#">Online security</a>
            <a href="#">Fighting financial crime</a>
            <a href="#">Our suppliers</a>
            <a href="#">FAQs</a>
            <a href="#">Our locations</a>
            <a href="#">Contact us</a>
            <a href="#">Sitemap</a>
            <a href="#">Manage cookies</a>
          </div>
        </div>
      </div>

      {/* Right side: social icons + copyright */}
      <div className="footer-right">
        <div className="footer-social">
          <a href="#">
            <FaFacebookF />
          </a>
          <a href="#">
            <FaInstagram />
          </a>
          <a href="#">
            <FaXTwitter />
          </a>
          <a href="#">
            <FaLinkedinIn />
          </a>
          <a href="#">
            <FaYoutube />
          </a>
        </div>
        <div className="footer-bottom">
          © Standard Chartered 2025.
          <br />
          All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
