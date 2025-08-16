import React, { useState } from 'react';
import './ContactSection.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    query: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <section className="contact-section section">
      <div className="container">
        <div className="contact-content">
          <div className="contact-left">
            <h2 className="contact-title">Please drop your queries and we'll contact you!</h2>
          </div>
          <div className="contact-right">
            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Enter Your Name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Enter Your Email Address"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Enter Your Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                required
              />
              <textarea
                name="query"
                placeholder="Enter Your Query"
                value={formData.query}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
                required
              ></textarea>
              <button type="submit" className="btn btn-primary form-submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
