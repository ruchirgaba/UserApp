import React from 'react';
import './AboutSection.css';
import oldman1 from '../oldman1.jpg';
import oldman2 from '../oldman2.jpg';
import oldman3 from '../oldman3.jpg';

const AboutSection = () => {
  const services = [
    {
      id: 1,
      title: 'Wealth & Retail Banking',
      description: 'Wealth and Retail Banking serves the local and international banking needs of clients across the wealth spectrum from Personal to Priority and Private Banking, as well as Small and Medium Enterprises.',
      image: oldman1,
      alt: 'Business professional'
    },
    {
      id: 2,
      title: 'Corporate & Investment Banking',
      description: 'Corporate & Investment Banking supports large corporations, development organisations, governments, banks and investors to access cross border trade and investment opportunities.',
      image: oldman2,
      alt: 'Business woman'
    },
    {
      id: 3,
      title: 'Be fraud aware',
      description: 'Stay informed about the latest scam methods and find out how you can report suspicious activity to help us fight back against fraud.',
      image: oldman3,
      alt: 'Security concept'
    }
  ];

  return (
    <section className="about-section section">
      <div className="container">
        <h2 className="section-title">About Us</h2>
        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-image">
                <img src={service.image} alt={service.alt} />
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <button className="btn btn-primary service-btn">Read More →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
