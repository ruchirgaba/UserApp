import React from "react";
import "./Hero.css";
import home1 from "../home1.png";

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-title">
              Loans by
              <br />
              <span className="brand-name">Standard Chartered</span>
            </h1>
            <p className="hero-subtitle">Our Motto</p>
            <p className="hero-tagline">Here for good.</p>

            <div className="hero-features">
              <div className="feature-item">
                <span className="checkmark">✓</span>
                <span>Quick approvals</span>
              </div>
              <div className="feature-item">
                <span className="checkmark">✓</span>
                <span>Easy Documentation</span>
              </div>
              <div className="feature-item">
                <span className="checkmark">✓</span>
                <span>Best Interest rates</span>
              </div>
            </div>

            <button className="btn btn-primary hero-cta">
              Apply for a loan →
            </button>
          </div>

          <div className="hero-right">
            <div className="hero-card">
              <div className="card-illustration">
                <img src={home1} alt="Loan Application Illustration" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
