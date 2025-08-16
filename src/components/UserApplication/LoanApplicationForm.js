import React, { useState, useEffect } from "react";
import "./LoanApplicationForm.css";
import HeaderLoggedIn from "../LoggedIn/HeaderLoggedIn";
import Footer from "../LoggedIn/Footer";

const LoanApplicationForm = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showReview, setShowReview] = useState(false);
  const [allSectionsCompleted, setAllSectionsCompleted] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  
  const steps = [
    { id: 1, title: "Personal Details", key: "personal" },
    { id: 2, title: "Employment Details", key: "employment" },
    { id: 3, title: "Loan Details", key: "loan" },
    { id: 4, title: "Document Upload", key: "documents" },
    { id: 5, title: "Existing Loans", key: "existing" },
    { id: 6, title: "References", key: "references" },
    { id: 7, title: "Review Application", key: "review" }
  ];

  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    phoneNumber: "",
    maritalStatus: "",
    panNumber: "",
    passportNumber: "",
    gender: "",
    currentAddress: "",
    permanentAddress: "",
    dateOfBirth: "",

    // Employment Details
    occupationType: "",
    totalWorkExperience: "",
    monthlyCompanyIncome: "",
    unemploymentIncome: "",
    companyName: "",
    officeAddress: "",

    // Loan Details
    loanType: "",
    loanAmount: "",
    loanDuration: "",
    loanPurpose: "",

    // Existing Loan Details
    existingLoanFullName: "",
    existingLoanType: "",
    existingLoanContactNumber: "",
    existingLoanLender: "",
    existingLoanEmail: "",
    existingLoanOutstandingAmount: "",
    existingLoanAddress: "",
    existingLoanEMITenure: "",

    // References
    referenceFullName: "",
    referenceRelationship: "",
    referenceContactNumber: "",
    referenceAddress: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});

  // Step validation functions
  const validateStep = (stepKey) => {
    const stepErrors = {};
    let isValid = true;

    switch (stepKey) {
      case "personal":
        const personalFields = ["fullName", "phoneNumber", "panNumber", "currentAddress", "permanentAddress", "dateOfBirth", "maritalStatus", "gender"];
        personalFields.forEach(field => {
          const error = validateField(field, formData[field]);
          if (error) {
            stepErrors[field] = error;
            isValid = false;
          }
        });
        break;
      case "employment":
        const employmentFields = ["occupationType", "companyName", "totalWorkExperience", "monthlyCompanyIncome", "officeAddress"];
        employmentFields.forEach(field => {
          const error = validateField(field, formData[field]);
          if (error) {
            stepErrors[field] = error;
            isValid = false;
          }
        });
        break;
      case "loan":
        const loanFields = ["loanType", "loanAmount", "loanDuration", "loanPurpose"];
        loanFields.forEach(field => {
          const error = validateField(field, formData[field]);
          if (error) {
            stepErrors[field] = error;
            isValid = false;
          }
        });
        break;
      case "documents":
        // Check if required documents are uploaded
        const requiredDocs = ["panCard", "aadharCard", "salarySlips", "bankStatements"];
        requiredDocs.forEach(doc => {
          if (!uploadedFiles[doc]) {
            stepErrors[doc] = "This document is required";
            isValid = false;
          }
        });
        break;
      case "existing":
        // Optional section - but validate fields if they have values
        isValid = true; // Start with true since section is optional
        
        // Validate email if it has a value
        if (formData["existingLoanEmail"] && formData["existingLoanEmail"].trim() !== "") {
          const emailError = validateField("existingLoanEmail", formData["existingLoanEmail"]);
          if (emailError) {
            stepErrors["existingLoanEmail"] = emailError;
            isValid = false;
          }
        }
        
        // Validate outstanding amount if it has a value
        if (formData["existingLoanOutstandingAmount"] && formData["existingLoanOutstandingAmount"] !== "") {
          const amountError = validateField("existingLoanOutstandingAmount", formData["existingLoanOutstandingAmount"]);
          if (amountError) {
            stepErrors["existingLoanOutstandingAmount"] = amountError;
            isValid = false;
          }
        }
        
        // If valid, find the step ID for existing loans section
        if (isValid) {
          const existingStepId = steps.find(step => step.key === "existing")?.id;
          if (existingStepId) {
            // Add to completed steps if not already there
            setCompletedSteps(prev => new Set([...prev, existingStepId]));
          }
        }
        break;
      case "references":
        const referenceFields = ["referenceFullName", "referenceContactNumber", "referenceRelationship", "referenceAddress"];
        referenceFields.forEach(field => {
          const error = validateField(field, formData[field]);
          if (error) {
            stepErrors[field] = error;
            isValid = false;
          }
        });
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, ...stepErrors }));
    return isValid;
  };

  // Check if all sections are completed
  useEffect(() => {
    // Only run this effect if we're not already in the review step
    if (currentStep !== 7) {
      const requiredSteps = steps.slice(0, 6); // First 6 steps are required
      const isAllCompleted = requiredSteps.every(step => completedSteps.has(step.id));
      setAllSectionsCompleted(isAllCompleted);
      console.log("Completed steps:", Array.from(completedSteps));
      console.log("All sections completed:", isAllCompleted);
      
      // If we're on step 6 and all steps are completed, enable the review button
      if (currentStep === 6 && isAllCompleted) {
        console.log("All sections completed and on step 6, enabling review button");
      }
    }
  }, [completedSteps, steps, currentStep]);

  const handleNextStep = () => {
    const currentStepData = steps.find(step => step.id === currentStep);
    
    if (currentStepData.key === "review") {
      handleSubmit();
      return;
    }
    
    if (validateStep(currentStepData.key)) {
      // Update completed steps
      const newCompletedSteps = new Set([...completedSteps, currentStep]);
      setCompletedSteps(newCompletedSteps);
      
      // If we're at the references section (step 6), move directly to review
      if (currentStep === 6) {
        setShowReview(true);
        setCurrentStep(7); // Move to review step
        setAllSectionsCompleted(true); // Explicitly set to true
      } else if (currentStep < steps.length - 1) { // -1 because review step is handled separately
        setCurrentStep(currentStep + 1);
      }
    } else {
      // Mark all fields in current step as touched to show errors
      const stepFields = getStepFields(currentStepData.key);
      const newTouched = {};
      stepFields.forEach(field => {
        newTouched[field] = true;
      });
      setTouched(prev => ({ ...prev, ...newTouched }));
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      // If we're in review step, go back to the last form step
      if (currentStep === 7) {
        setShowReview(false);
        setCurrentStep(6);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const getStepFields = (stepKey) => {
    switch (stepKey) {
      case "personal":
        return ["fullName", "phoneNumber", "panNumber", "currentAddress", "permanentAddress", "dateOfBirth", "maritalStatus", "gender"];
      case "employment":
        return ["occupationType", "companyName", "totalWorkExperience", "monthlyCompanyIncome", "officeAddress"];
      case "loan":
        return ["loanType", "loanAmount", "loanDuration", "loanPurpose"];
      case "documents":
        return [];
      case "existing":
        return ["existingLoanFullName", "existingLoanType", "existingLoanContactNumber", "existingLoanLender", "existingLoanEmail", "existingLoanOutstandingAmount", "existingLoanAddress", "existingLoanEMITenure"];
      case "references":
        return ["referenceFullName", "referenceContactNumber", "referenceRelationship", "referenceAddress"];
      default:
        return [];
    }
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value || !value.trim()) error = "Full name is required";
        else if (value.trim().length < 2)
          error = "Name must be at least 2 characters";
        break;
      case "phoneNumber":
        if (!value || !value.trim()) error = "Phone number is required";
        else if (!/^\d{10}$/.test(value.replace(/\D/g, "")))
          error = "Please enter a valid 10-digit phone number";
        break;
      case "panNumber":
        if (!value || !value.trim()) error = "PAN number is required";
        else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase()))
          error = "Please enter a valid PAN number";
        break;
      case "currentAddress":
        if (!value || !value.trim()) error = "Current address is required";
        else if (value.trim().length < 10)
          error = "Please enter a complete address";
        break;
      case "permanentAddress":
        if (!value || !value.trim()) error = "Permanent address is required";
        else if (value.trim().length < 10)
          error = "Please enter a complete address";
        break;
      case "dateOfBirth":
        if (!value || !value.trim()) error = "Date of birth is required";
        break;
      case "maritalStatus":
        if (!value || !value.trim()) error = "Marital status is required";
        break;
      case "gender":
        if (!value || !value.trim()) error = "Gender is required";
        break;
      case "occupationType":
        if (!value || !value.trim()) error = "Occupation type is required";
        break;
      case "companyName":
        if (!value || !value.trim()) error = "Company name is required";
        break;
      case "totalWorkExperience":
        if (!value || !value.trim()) error = "Work experience is required";
        else if (isNaN(parseFloat(value)) || parseFloat(value) <= 0)
          error = "Total work experience should be greater than 0 years";
        break;
      case "monthlyCompanyIncome":
        if (!value || !value.trim()) error = "Monthly income is required";
        else if (isNaN(value) || parseFloat(value) <= 0)
          error = "Please enter a valid income amount";
        break;
      case "unemploymentIncome":
        if (value && (isNaN(value) || parseFloat(value) < 0))
          error = "Please enter a valid positive amount";
        break;
      case "officeAddress":
        if (!value || !value.trim()) error = "Office address is required";
        break;
      case "loanType":
        if (!value || !value.trim()) error = "Loan type is required";
        break;
      case "loanAmount":
        if (!value || !value.trim()) error = "Loan amount is required";
        else if (isNaN(value) || parseFloat(value) <= 0)
          error = "Please enter a valid amount";
        break;
      case "loanDuration":
        if (!value || !value.trim()) error = "Loan duration is required";
        break;
      case "loanPurpose":
        if (!value || !value.trim()) error = "Loan purpose is required";
        break;
      case "existingLoanEmail":
        if (value && value.trim()) {
          const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
          if (!emailRegex.test(value.trim())) {
            error = "Please enter a valid email address";
          }
        }
        break;
      case "existingLoanOutstandingAmount":
        if (value !== "") {
          const numValue = parseFloat(value);
          if (isNaN(numValue) || numValue <= 0) {
            error = "Please enter a valid amount";
          }
        }
        break;
      case "existingLoanEMITenure":
        if (value !== "") {
          const numValue = parseFloat(value);
          if (isNaN(numValue) || numValue <= 0 || !Number.isInteger(Number(value))) {
            error = "Please enter a valid positive integer";
          }
        }
        break;
      case "referenceFullName":
        if (!value || !value.trim()) error = "Reference name is required";
        break;
      case "referenceContactNumber":
        if (!value || !value.trim()) error = "Reference contact is required";
        else if (!/^\d{10}$/.test(value.replace(/\D/g, "")))
          error = "Please enter a valid 10-digit phone number";
        break;
      case "referenceRelationship":
        if (!value || !value.trim()) error = "Relationship is required";
        break;
      case "referenceAddress":
        if (!value || !value.trim()) error = "Reference address is required";
        break;
      default:
        break;
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleFileUpload = (documentType, file) => {
    if (file) {
      setUploadedFiles((prev) => ({
        ...prev,
        [documentType]: file,
      }));
    }
  };

  const triggerFileInput = (inputId) => {
    document.getElementById(inputId).click();
  };

  const handleEditSection = (sectionId) => {
    setEditingSection(sectionId);
    setShowReview(false);
    setCurrentStep(sectionId);
  };

  const handleReturnToReview = () => {
    // Validate the current section before returning to review
    const currentStepData = steps.find(step => step.id === currentStep);
    if (validateStep(currentStepData.key)) {
      // Update completed steps
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      // Return to review page
      setEditingSection(null);
      setShowReview(true);
      setCurrentStep(7);
      // Show success message for editing
      alert("Section edited successfully!");
    } else {
      // Mark all fields in current step as touched to show errors
      const stepFields = getStepFields(currentStepData.key);
      const newTouched = {};
      stepFields.forEach(field => {
        newTouched[field] = true;
      });
      setTouched(prev => ({ ...prev, ...newTouched }));
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Validate all steps before final submission
    let allStepsValid = true;
    steps.slice(0, 6).forEach(step => { // Only validate the first 6 steps
      if (!validateStep(step.key)) {
        allStepsValid = false;
      }
    });

    if (allStepsValid) {
      console.log("Form submitted successfully:", {
        formData,
        uploadedFiles,
      });
      alert("Application submitted successfully!");
    } else {
      alert("Please complete all required fields in all sections.");
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="progress-container">
        <div className="progress-bar">
          {steps.map((step, index) => (
            <div key={step.id} className="progress-step">
              <div className={`step-circle ${
                currentStep === step.id ? 'active' : 
                completedSteps.has(step.id) ? 'completed' : 'pending'
              }`}>
                {completedSteps.has(step.id) ? '✓' : step.id}
              </div>
              <div className="step-label">{step.title}</div>
              {index < steps.length - 1 && (
                <div className={`step-connector ${
                  completedSteps.has(step.id) ? 'completed' : 'pending'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalDetails();
      case 2:
        return renderEmploymentDetails();
      case 3:
        return renderLoanDetails();
      case 4:
        return renderDocumentUpload();
      case 5:
        return renderExistingLoans();
      case 6:
        return renderReferences();
      case 7:
        return renderReviewApplication();
      default:
        return null;
    }
  };

  const renderPersonalDetails = () => (
    <section className="form-section">
      <h2>Personal Details</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className={`form-input ${
              touched.fullName && errors.fullName ? "error" : ""
            }`}
            required
          />
          {touched.fullName && errors.fullName && (
            <small className="error-text">{errors.fullName}</small>
          )}
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className={`form-input ${
              touched.phoneNumber && errors.phoneNumber ? "error" : ""
            }`}
            required
          />
          {touched.phoneNumber && errors.phoneNumber && (
            <small className="error-text">{errors.phoneNumber}</small>
          )}
        </div>
        <div className="form-group">
          <label>Marital Status:</label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`form-input ${
              touched.maritalStatus && errors.maritalStatus ? "error" : ""
            }`}
            required
          >
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
          {touched.maritalStatus && errors.maritalStatus && (
            <small className="error-text">{errors.maritalStatus}</small>
          )}
        </div>
        <div className="form-group">
          <label>PAN Number:</label>
          <input
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="ABCDE1234F"
            className={`form-input ${
              touched.panNumber && errors.panNumber ? "error" : ""
            }`}
            required
          />
          {touched.panNumber && errors.panNumber && (
            <small className="error-text">{errors.panNumber}</small>
          )}
        </div>
        <div className="form-group">
          <label>Passport Number:</label>
          <input
            type="text"
            name="passportNumber"
            value={formData.passportNumber}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`form-input ${
              touched.gender && errors.gender ? "error" : ""
            }`}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {touched.gender && errors.gender && (
            <small className="error-text">{errors.gender}</small>
          )}
        </div>
        <div className="form-group">
          <label>Current Address:</label>
          <textarea
            name="currentAddress"
            value={formData.currentAddress}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className={`form-input ${
              touched.currentAddress && errors.currentAddress ? "error" : ""
            }`}
            required
          />
          {touched.currentAddress && errors.currentAddress && (
            <small className="error-text">{errors.currentAddress}</small>
          )}
        </div>
        <div className="form-group">
          <label>Permanent Address:</label>
          <textarea
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className={`form-input ${
              touched.permanentAddress && errors.permanentAddress ? "error" : ""
            }`}
            required
          />
          {touched.permanentAddress && errors.permanentAddress && (
            <small className="error-text">{errors.permanentAddress}</small>
          )}
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`form-input ${
              touched.dateOfBirth && errors.dateOfBirth ? "error" : ""
            }`}
            required
          />
          {touched.dateOfBirth && errors.dateOfBirth && (
            <small className="error-text">{errors.dateOfBirth}</small>
          )}
        </div>
      </div>
    </section>
  );

  const renderEmploymentDetails = () => (
    <section className="form-section">
      <h2>Employment Details</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Occupation Type:</label>
          <select
            name="occupationType"
            value={formData.occupationType}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`form-input ${
              touched.occupationType && errors.occupationType ? "error" : ""
            }`}
            required
          >
            <option value="">Select Occupation</option>
            <option value="salaried">Salaried</option>
            <option value="self-employed">Self Employed</option>
            <option value="business">Business Owner</option>
            <option value="freelancer">Freelancer</option>
          </select>
          {touched.occupationType && errors.occupationType && (
            <small className="error-text">{errors.occupationType}</small>
          )}
        </div>
        <div className="form-group">
          <label>Total Work Experience:</label>
          <input
            type="text"
            name="totalWorkExperience"
            value={formData.totalWorkExperience}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="e.g., 5 years"
            className={`form-input ${
              touched.totalWorkExperience && errors.totalWorkExperience ? "error" : ""
            }`}
            required
          />
          {touched.totalWorkExperience && errors.totalWorkExperience && (
            <small className="error-text">{errors.totalWorkExperience}</small>
          )}
        </div>
        <div className="form-group">
          <label>Monthly Company Income:</label>
          <input
            type="number"
            name="monthlyCompanyIncome"
            value={formData.monthlyCompanyIncome}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className={`form-input ${
              touched.monthlyCompanyIncome && errors.monthlyCompanyIncome ? "error" : ""
            }`}
            required
          />
          {touched.monthlyCompanyIncome && errors.monthlyCompanyIncome && (
            <small className="error-text">{errors.monthlyCompanyIncome}</small>
          )}
        </div>
        <div className="form-group">
          <label>Unemployment Income:</label>
          <input
            type="number"
            name="unemploymentIncome"
            value={formData.unemploymentIncome}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            min="0"
            className={`form-input ${errors.unemploymentIncome ? "error" : ""}`}
          />
        </div>
        <div className="form-group">
          <label>Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className={`form-input ${
              touched.companyName && errors.companyName ? "error" : ""
            }`}
            required
          />
          {touched.companyName && errors.companyName && (
            <small className="error-text">{errors.companyName}</small>
          )}
        </div>
        <div className="form-group">
          <label>Office Address:</label>
          <textarea
            name="officeAddress"
            value={formData.officeAddress}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className={`form-input ${
              touched.officeAddress && errors.officeAddress ? "error" : ""
            }`}
            required
          />
          {touched.officeAddress && errors.officeAddress && (
            <small className="error-text">{errors.officeAddress}</small>
          )}
        </div>
      </div>
    </section>
  );

  const renderLoanDetails = () => (
    <section className="form-section">
      <h2>Loan Details</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Loan Type:</label>
          <select
            name="loanType"
            value={formData.loanType}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`form-input ${
              touched.loanType && errors.loanType ? "error" : ""
            }`}
            required
          >
            <option value="">Select Loan Type</option>
            <option value="personal">Personal Loan</option>
            <option value="home">Home Loan</option>
            <option value="car">Car Loan</option>
            <option value="business">Business Loan</option>
            <option value="education">Education Loan</option>
          </select>
          {touched.loanType && errors.loanType && (
            <small className="error-text">{errors.loanType}</small>
          )}
        </div>
        <div className="form-group">
          <label>Loan Amount:</label>
          <input
            type="number"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className={`form-input ${
              touched.loanAmount && errors.loanAmount ? "error" : ""
            }`}
            required
          />
          {touched.loanAmount && errors.loanAmount && (
            <small className="error-text">{errors.loanAmount}</small>
          )}
        </div>
        <div className="form-group">
          <label>Loan Duration:</label>
          <select
            name="loanDuration"
            value={formData.loanDuration}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`form-input ${
              touched.loanDuration && errors.loanDuration ? "error" : ""
            }`}
            required
          >
            <option value="">Select Duration</option>
            <option value="1">1 Year</option>
            <option value="2">2 Years</option>
            <option value="3">3 Years</option>
            <option value="5">5 Years</option>
            <option value="10">10 Years</option>
            <option value="15">15 Years</option>
            <option value="20">20 Years</option>
          </select>
          {touched.loanDuration && errors.loanDuration && (
            <small className="error-text">{errors.loanDuration}</small>
          )}
        </div>
        <div className="form-group">
          <label>Loan Purpose:</label>
          <textarea
            name="loanPurpose"
            value={formData.loanPurpose}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className={`form-input ${
              touched.loanPurpose && errors.loanPurpose ? "error" : ""
            }`}
            required
          />
          {touched.loanPurpose && errors.loanPurpose && (
            <small className="error-text">{errors.loanPurpose}</small>
          )}
        </div>
      </div>
    </section>
  );

  const renderDocumentUpload = () => (
    <section className="form-section">
      <h2>Document Upload</h2>
      <div className="document-upload-grid">
        <div className="document-item">
          <label>PAN Card:</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="panCard"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload("panCard", e.target.files[0])}
              style={{ display: "none" }}
            />
            <button
              type="button"
              onClick={() => triggerFileInput("panCard")}
              className="upload-btn"
            >
              {uploadedFiles.panCard ? "✓ Uploaded" : "Upload PAN Card"}
            </button>
            {errors.panCard && <small className="error-text">{errors.panCard}</small>}
          </div>
        </div>
        <div className="document-item">
          <label>Aadhar Card:</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="aadharCard"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload("aadharCard", e.target.files[0])}
              style={{ display: "none" }}
            />
            <button
              type="button"
              onClick={() => triggerFileInput("aadharCard")}
              className="upload-btn"
            >
              {uploadedFiles.aadharCard ? "✓ Uploaded" : "Upload Aadhar Card"}
            </button>
            {errors.aadharCard && <small className="error-text">{errors.aadharCard}</small>}
          </div>
        </div>
        <div className="document-item">
          <label>Salary Slips (Last 3 months):</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="salarySlips"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={(e) => handleFileUpload("salarySlips", e.target.files[0])}
              style={{ display: "none" }}
            />
            <button
              type="button"
              onClick={() => triggerFileInput("salarySlips")}
              className="upload-btn"
            >
              {uploadedFiles.salarySlips ? "✓ Uploaded" : "Upload Salary Slips"}
            </button>
            {errors.salarySlips && <small className="error-text">{errors.salarySlips}</small>}
          </div>
        </div>
        <div className="document-item">
          <label>Bank Statements (Last 6 months):</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="bankStatements"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={(e) => handleFileUpload("bankStatements", e.target.files[0])}
              style={{ display: "none" }}
            />
            <button
              type="button"
              onClick={() => triggerFileInput("bankStatements")}
              className="upload-btn"
            >
              {uploadedFiles.bankStatements ? "✓ Uploaded" : "Upload Bank Statements"}
            </button>
            {errors.bankStatements && <small className="error-text">{errors.bankStatements}</small>}
          </div>
        </div>
      </div>
    </section>
  );

  // Mark existing loans section as completed when it's rendered
  useEffect(() => {
    if (currentStep === 5) { // When on the Existing Loans step
      const existingStepId = steps.find(step => step.key === "existing")?.id;
      if (existingStepId) {
        setCompletedSteps(prev => new Set([...prev, existingStepId]));
      }
    }
  }, [currentStep, steps]);

  const renderExistingLoans = () => {
    // Auto-mark this section as completed since it's optional
    const existingStepId = steps.find(step => step.key === "existing")?.id;
    if (existingStepId && !completedSteps.has(existingStepId)) {
      // Use setTimeout to avoid state updates during render
      setTimeout(() => {
        setCompletedSteps(prev => new Set([...prev, existingStepId]));
      }, 0);
    }
    
    return (
      <section className="form-section">
        <h2>Existing Loan Details (Optional)</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              name="existingLoanFullName"
              value={formData.existingLoanFullName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Type here"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Loan Type:</label>
            <select
              name="existingLoanType"
              value={formData.existingLoanType}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`form-input ${errors.existingLoanType ? "error" : ""}`}
            >
              <option value="">Select Loan Type</option>
              <option value="personal">Personal Loan</option>
              <option value="home">Home Loan</option>
              <option value="car">Car Loan</option>
              <option value="business">Business Loan</option>
              <option value="education">Education Loan</option>
            </select>
            {errors.existingLoanType && (
              <div className="error-message">{errors.existingLoanType}</div>
            )}
          </div>
          <div className="form-group">
            <label>Contact Number:</label>
            <input
              type="tel"
              name="existingLoanContactNumber"
              value={formData.existingLoanContactNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Type here"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Lender:</label>
            <input
              type="text"
              name="existingLoanLender"
              value={formData.existingLoanLender}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Type here"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="existingLoanEmail"
              value={formData.existingLoanEmail}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Type here"
              className={`form-input ${errors.existingLoanEmail ? "error" : ""}`}
            />
            {errors.existingLoanEmail && (
              <div className="error-message">{errors.existingLoanEmail}</div>
            )}
          </div>
          <div className="form-group">
            <label>Outstanding Amount:</label>
            <input
              type="number"
              name="existingLoanOutstandingAmount"
              value={formData.existingLoanOutstandingAmount}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Type here"
              className={`form-input ${errors.existingLoanOutstandingAmount ? "error" : ""}`}
            />
            {errors.existingLoanOutstandingAmount && (
              <div className="error-message">{errors.existingLoanOutstandingAmount}</div>
            )}
          </div>
          <div className="form-group">
            <label>Address:</label>
            <textarea
              name="existingLoanAddress"
              value={formData.existingLoanAddress}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Type here"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>EMI Tenure Remaining:</label>
            <input
              type="number"
              name="existingLoanEMITenure"
              value={formData.existingLoanEMITenure}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Type here"
              min="1"
              step="1"
              className={`form-input ${errors.existingLoanEMITenure ? "error" : ""}`}
            />
            {errors.existingLoanEMITenure && (
              <div className="error-message">{errors.existingLoanEMITenure}</div>
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderReferences = () => (
    <section className="form-section">
      <h2>Reference</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            name="referenceFullName"
            value={formData.referenceFullName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className={`form-input ${
              touched.referenceFullName && errors.referenceFullName ? "error" : ""
            }`}
            required
          />
          {touched.referenceFullName && errors.referenceFullName && (
            <small className="error-text">{errors.referenceFullName}</small>
          )}
        </div>
        <div className="form-group">
          <label>Relationship with Applicant:</label>
          <input
            type="text"
            name="referenceRelationship"
            value={formData.referenceRelationship}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className={`form-input ${
              touched.referenceRelationship && errors.referenceRelationship ? "error" : ""
            }`}
            required
          />
          {touched.referenceRelationship && errors.referenceRelationship && (
            <small className="error-text">{errors.referenceRelationship}</small>
          )}
        </div>
        <div className="form-group">
          <label>Contact Number:</label>
          <input
            type="tel"
            name="referenceContactNumber"
            value={formData.referenceContactNumber}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className={`form-input ${
              touched.referenceContactNumber && errors.referenceContactNumber ? "error" : ""
            }`}
            required
          />
          {touched.referenceContactNumber && errors.referenceContactNumber && (
            <small className="error-text">{errors.referenceContactNumber}</small>
          )}
        </div>
        <div className="form-group">
          <label>Address:</label>
          <textarea
            name="referenceAddress"
            value={formData.referenceAddress}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className={`form-input ${
              touched.referenceAddress && errors.referenceAddress ? "error" : ""
            }`}
            required
          />
          {touched.referenceAddress && errors.referenceAddress && (
            <small className="error-text">{errors.referenceAddress}</small>
          )}
        </div>
      </div>
    </section>
  );

  const renderReviewApplication = () => (
    <section className="form-section review-section">
      <h2>Review Your Application</h2>
      <p>Please review all the information you have provided before final submission.</p>
      
      <div className="review-container">
        {/* Personal Details Review */}
        <div className="review-section-card">
          <div className="review-header">
            <h3>Personal Details</h3>
            <button 
              type="button" 
              className="edit-btn"
              onClick={() => handleEditSection(1)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            <p><strong>Full Name:</strong> {formData.fullName}</p>
            <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
            <p><strong>Marital Status:</strong> {formData.maritalStatus}</p>
            <p><strong>PAN Number:</strong> {formData.panNumber}</p>
            <p><strong>Passport Number:</strong> {formData.passportNumber || 'Not provided'}</p>
            <p><strong>Gender:</strong> {formData.gender}</p>
            <p><strong>Current Address:</strong> {formData.currentAddress}</p>
            <p><strong>Permanent Address:</strong> {formData.permanentAddress}</p>
            <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
          </div>
        </div>

        {/* Employment Details Review */}
        <div className="review-section-card">
          <div className="review-header">
            <h3>Employment Details</h3>
            <button 
              type="button" 
              className="edit-btn"
              onClick={() => handleEditSection(2)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            <p><strong>Occupation Type:</strong> {formData.occupationType}</p>
            <p><strong>Total Work Experience:</strong> {formData.totalWorkExperience}</p>
            <p><strong>Monthly Income:</strong> {formData.monthlyCompanyIncome}</p>
            <p><strong>Unemployment Income:</strong> {formData.unemploymentIncome || 'Not provided'}</p>
            <p><strong>Company Name:</strong> {formData.companyName}</p>
            <p><strong>Office Address:</strong> {formData.officeAddress}</p>
          </div>
        </div>

        {/* Loan Details Review */}
        <div className="review-section-card">
          <div className="review-header">
            <h3>Loan Details</h3>
            <button 
              type="button" 
              className="edit-btn"
              onClick={() => handleEditSection(3)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            <p><strong>Loan Type:</strong> {formData.loanType}</p>
            <p><strong>Loan Amount:</strong> {formData.loanAmount}</p>
            <p><strong>Loan Duration:</strong> {formData.loanDuration}</p>
            <p><strong>Loan Purpose:</strong> {formData.loanPurpose}</p>
          </div>
        </div>

        {/* Document Upload Review */}
        <div className="review-section-card">
          <div className="review-header">
            <h3>Document Upload</h3>
            <button 
              type="button" 
              className="edit-btn"
              onClick={() => handleEditSection(4)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            <p><strong>PAN Card:</strong> {uploadedFiles.panCard ? uploadedFiles.panCard.name : 'Not uploaded'}</p>
            <p><strong>Aadhar Card:</strong> {uploadedFiles.aadharCard ? uploadedFiles.aadharCard.name : 'Not uploaded'}</p>
            <p><strong>Salary Slips:</strong> {uploadedFiles.salarySlips ? uploadedFiles.salarySlips.name : 'Not uploaded'}</p>
            <p><strong>Bank Statements:</strong> {uploadedFiles.bankStatements ? uploadedFiles.bankStatements.name : 'Not uploaded'}</p>
          </div>
        </div>

        {/* Existing Loans Review */}
        <div className="review-section-card">
          <div className="review-header">
            <h3>Existing Loans</h3>
            <button 
              type="button" 
              className="edit-btn"
              onClick={() => handleEditSection(5)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            {formData.existingLoanFullName ? (
              <>
                <p><strong>Full Name:</strong> {formData.existingLoanFullName}</p>
                <p><strong>Loan Type:</strong> {formData.existingLoanType}</p>
                <p><strong>Contact Number:</strong> {formData.existingLoanContactNumber}</p>
                <p><strong>Lender:</strong> {formData.existingLoanLender}</p>
                <p><strong>Email:</strong> {formData.existingLoanEmail}</p>
                <p><strong>Outstanding Amount:</strong> {formData.existingLoanOutstandingAmount}</p>
                <p><strong>Address:</strong> {formData.existingLoanAddress}</p>
                <p><strong>EMI Tenure:</strong> {formData.existingLoanEMITenure}</p>
              </>
            ) : (
              <p>No existing loans provided</p>
            )}
          </div>
        </div>

        {/* References Review */}
        <div className="review-section-card">
          <div className="review-header">
            <h3>References</h3>
            <button 
              type="button" 
              className="edit-btn"
              onClick={() => handleEditSection(6)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            <p><strong>Full Name:</strong> {formData.referenceFullName}</p>
            <p><strong>Relationship:</strong> {formData.referenceRelationship}</p>
            <p><strong>Contact Number:</strong> {formData.referenceContactNumber}</p>
            <p><strong>Address:</strong> {formData.referenceAddress}</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="loan-application-container">
      <HeaderLoggedIn />

      <main className="application-main">
        <div className="container">
          <div className="application-header">
            <h1>Loan Application Form</h1>
            <p>Please fill out all the required information below</p>
          </div>

          {/* Progress Bar */}
          {renderProgressBar()}

          <form onSubmit={handleSubmit} className="loan-form">
            {/* Render Current Step */}
            {renderCurrentStep()}

            {/* Navigation Buttons */}
            <div className="form-navigation">
              <div className="nav-buttons">
                {currentStep > 1 && currentStep !== 7 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="nav-btn prev-btn"
                  >
                    ← Previous
                  </button>
                )}
                
                {editingSection ? (
                  <button
                    type="button"
                    onClick={handleReturnToReview}
                    className="nav-btn next-btn"
                    style={{ backgroundColor: '#4CAF50' }}
                  >
                    Save & Return to Review
                  </button>
                ) : currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="nav-btn next-btn"
                  >
                    Next →
                  </button>
                ) : currentStep === 6 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="nav-btn next-btn"
                    style={{ backgroundColor: '#4CAF50' }}
                  >
                    Review Application →
                  </button>
                ) : (
                  <button type="submit" className="nav-btn submit-btn">
                    Submit Application
                  </button>
                )}
              </div>
              
              {/* Step Indicator */}
              <div className="step-indicator">
                {currentStep <= 6 ? `Step ${currentStep} of 6` : "Final Review"}
              </div>
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoanApplicationForm;
