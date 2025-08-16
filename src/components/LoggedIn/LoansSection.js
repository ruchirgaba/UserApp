import React, { useEffect, useRef, useState } from "react";
import "./LoansSection.css";
import goldImage from "../../gold.png";
import homeImage from "../../home.jpg";
import educationImage from "../../education.png";
import medicalImage from "../../medical.png";

const LoansSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2, // Trigger when 20% of the section is visible
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before fully visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const loans = [
    {
      id: 1,
      title: "Gold Loan",
      image: goldImage,
      alt: "Gold coins and plant",
    },
    {
      id: 2,
      title: "Home Loan",
      image: homeImage,
      alt: "House model",
    },
    {
      id: 3,
      title: "Education Loan",
      image: educationImage,
      alt: "Graduation cap and coins",
    },
    {
      id: 4,
      title: "Medical Loan",
      image: medicalImage,
      alt: "Medical stethoscope",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className={`loans-section section ${isVisible ? "animate-in" : ""} ${
        hoveredCard ? "has-hovered" : ""
      }`}
    >
      <div className="container">
        <h2 className={`section-title ${isVisible ? "animate-title" : ""}`}>
          Loans We Provide
        </h2>
        <div className="loans-grid">
          {loans.map((loan, index) => (
            <div
              key={loan.id}
              className={`loan-card ${isVisible ? "animate-card" : ""} ${
                hoveredCard && hoveredCard !== loan.id ? "blurred" : ""
              } ${hoveredCard === loan.id ? "focused" : ""}`}
              style={{
                animationDelay: isVisible ? `${index * 0.15}s` : "0s",
              }}
              onMouseEnter={() => setHoveredCard(loan.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="loan-image">
                <img src={loan.image} alt={loan.alt} />
              </div>
              <h3 className="loan-title">{loan.title}</h3>
            </div>
          ))}
        </div>
        <div className="loans-cta">
          <button className="btn btn-primary">Know More →</button>
        </div>
      </div>
    </section>
  );
};

export default LoansSection;
