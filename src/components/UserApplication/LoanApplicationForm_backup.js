import React, { useState } from "react";
import "./LoanApplicationForm.css";
import HeaderLoggedIn from "../LoggedIn/HeaderLoggedIn";
import Footer from "../LoggedIn/Footer";

const LoanApplicationForm = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  const steps = [
    { id: 1, title: "Personal Details", key: "personal" },
    { id: 2, title: "Employment Details", key: "employment" },
    { id: 3, title: "Loan Details", key: "loan" },
    { id: 4, title: "Document Upload", key: "documents" },
    { id: 5, title: "Existing Loans", key: "existing" },
    { id: 6, title: "References", key: "references" }
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
        // Optional section - no validation required
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

  const handleNextStep = () => {
    const currentStepData = steps.find(step => step.id === currentStep);
    if (validateStep(currentStepData.key)) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (currentStep < steps.length) {
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
      setCurrentStep(currentStep - 1);
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
        break;
      case "monthlyCompanyIncome":
        if (!value || !value.trim()) error = "Monthly income is required";
        else if (isNaN(value) || parseFloat(value) <= 0)
          error = "Please enter a valid income amount";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all steps before final submission
    let allStepsValid = true;
    steps.forEach(step => {
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
            className="form-input"
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

  const renderExistingLoans = () => (
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
          <input
            type="text"
            name="existingLoanType"
            value={formData.existingLoanType}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className="form-input"
          />
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
            className="form-input"
          />
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
            className="form-input"
          />
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
            type="text"
            name="existingLoanEMITenure"
            value={formData.existingLoanEMITenure}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className="form-input"
          />
        </div>
      </div>
    </section>
  );

  const renderReferences = () => (
    <section className="form-section">
      <h2>References</h2>
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
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="nav-btn prev-btn"
                  >
                    ← Previous
                  </button>
                )}
                
                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="nav-btn next-btn"
                  >
                    Next →
                  </button>
                ) : (
                  <button type="submit" className="nav-btn submit-btn">
                    Submit Application
                  </button>
                )}
              </div>
              
              {/* Step Indicator */}
              <div className="step-indicator">
                Step {currentStep} of {steps.length}
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
                  <input
                    type="text"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>PAN Number:</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
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
                  <input
                    type="text"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Current Address:</label>
                  <input
                    type="text"
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    className={`form-input ${
                      touched.currentAddress && errors.currentAddress
                        ? "error"
                        : ""
                    }`}
                    required
                  />
                  {touched.currentAddress && errors.currentAddress && (
                    <small className="error-text">
                      {errors.currentAddress}
                    </small>
                  )}
                </div>
                <div className="form-group">
                  <label>Permanent Address:</label>
                  <input
                    type="text"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    className={`form-input ${
                      touched.permanentAddress && errors.permanentAddress
                        ? "error"
                        : ""
                    }`}
                    required
                  />
                  {touched.permanentAddress && errors.permanentAddress && (
                    <small className="error-text">
                      {errors.permanentAddress}
                    </small>
                  )}
                </div>
                <div className="form-group">
                  <label>Date of Birth:</label>
                  <input
                    type="text"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
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

            {/* Document Upload Section - SECOND */}
            <section className="form-section">
              <h2>Please attach all the required documents:</h2>
              <div className="document-upload-row">
                <div className="document-upload-group">
                  <h3>Photograph</h3>
                  <p>(Passport size photograph not exceeding 2mb)</p>
                  <div className="upload-box large" onClick={() => triggerFileInput('photograph')}>
                    <div className="upload-icon">📁</div>
                    <span>{uploadedFiles['photograph'] ? uploadedFiles['photograph'].name : 'Click to upload'}</span>
                  </div>
                  <input
                    type="file"
                    id="photograph"
                    style={{ display: 'none' }}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleFileUpload('photograph', e.target.files[0])}
                  />
                </div>
                <div className="document-upload-group">
                  <h3>Identity Proof</h3>
                  <p>(Aadhaar Card, Pan Card, Voter ID, Driving License)</p>
                  <div className="upload-box large" onClick={() => triggerFileInput('identity-proof-general')}>
                    <div className="upload-icon">📁</div>
                    <span>{uploadedFiles['identity-proof-general'] ? uploadedFiles['identity-proof-general'].name : 'Click to upload'}</span>
                  </div>
                  <input
                    type="file"
                    id="identity-proof-general"
                    style={{ display: 'none' }}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleFileUpload('identity-proof-general', e.target.files[0])}
                  />
                </div>
                <div className="document-upload-group">
                  <h3>Address Proof</h3>
                  <p>(Utility bills, Passport, Rental Agreement)</p>
                  <div className="upload-box large" onClick={() => triggerFileInput('address-proof-general')}>
                    <div className="upload-icon">📁</div>
                    <span>{uploadedFiles['address-proof-general'] ? uploadedFiles['address-proof-general'].name : 'Click to upload'}</span>
                  </div>
                  <input
                    type="file"
                    id="address-proof-general"
                    style={{ display: 'none' }}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleFileUpload('address-proof-general', e.target.files[0])}
                  />
                </div>
              </div>
            </section>

            {/* Employment Details Section - THIRD */}
            <section className="form-section">
              <h2>Please fill the Employment/Occupation Details:</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Occupation Type:</label>
                  <input
                    type="text"
                    name="occupationType"
                    value={formData.occupationType}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Total work experience in years:</label>
                  <input
                    type="text"
                    name="totalWorkExperience"
                    value={formData.totalWorkExperience}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unemployment/other income/Business income:</label>
                  <input
                    type="text"
                    name="unemploymentIncome"
                    value={formData.unemploymentIncome}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Monthly company Salary:</label>
                  <input
                    type="text"
                    name="monthlyCompanyIncome"
                    value={formData.monthlyCompanyIncome}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Company:</label>
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
                  <input
                    type="text"
                    name="officeAddress"
                    value={formData.officeAddress}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Employment Document Uploads */}
              <div className="document-upload-row">
                <div className="document-upload-group">
                  <h3>6 months of salary slips</h3>
                  <div className="upload-box large" onClick={() => triggerFileInput('salary-slips')}>
                    <div className="upload-icon">📁</div>
                    <span>{uploadedFiles['salary-slips'] ? uploadedFiles['salary-slips'].name : 'Click to upload'}</span>
                  </div>
                  <input
                    type="file"
                    id="salary-slips"
                    style={{ display: 'none' }}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleFileUpload('salary-slips', e.target.files[0])}
                  />
                </div>
                <div className="document-upload-group">
                  <h3>Last 3 years of ITR</h3>
                  <div className="upload-box large" onClick={() => triggerFileInput('itr-documents')}>
                    <div className="upload-icon">📁</div>
                    <span>{uploadedFiles['itr-documents'] ? uploadedFiles['itr-documents'].name : 'Click to upload'}</span>
                  </div>
                  <input
                    type="file"
                    id="itr-documents"
                    style={{ display: 'none' }}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleFileUpload('itr-documents', e.target.files[0])}
                  />
                </div>
                <div className="document-upload-group">
                  <h3>Self employed proof.</h3>
                  <div className="upload-box large" onClick={() => triggerFileInput('self-employed-proof-1')}>
                    <div className="upload-icon">📁</div>
                    <span>{uploadedFiles['self-employed-proof-1'] ? uploadedFiles['self-employed-proof-1'].name : 'Click to upload'}</span>
                  </div>
                  <input
                    type="file"
                    id="self-employed-proof-1"
                    style={{ display: 'none' }}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleFileUpload('self-employed-proof-1', e.target.files[0])}
                  />
                </div>
              </div>

              <div className="document-upload-row">
                <div className="document-upload-group">
                  <h3>Employment proof</h3>
                  <div className="upload-box large" onClick={() => triggerFileInput('employment-proof')}>
                    <div className="upload-icon">📁</div>
                    <span>{uploadedFiles['employment-proof'] ? uploadedFiles['employment-proof'].name : 'Click to upload'}</span>
                  </div>
                  <input
                    type="file"
                    id="employment-proof"
                    style={{ display: 'none' }}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleFileUpload('employment-proof', e.target.files[0])}
                  />
                </div>
                <div className="document-upload-group">
                  <h3>Self employed proof</h3>
                  <div className="upload-box large" onClick={() => triggerFileInput('self-employed-proof-2')}>
                    <div className="upload-icon">📁</div>
                    <span>{uploadedFiles['self-employed-proof-2'] ? uploadedFiles['self-employed-proof-2'].name : 'Click to upload'}</span>
                  </div>
                  <input
                    type="file"
                    id="self-employed-proof-2"
                    style={{ display: 'none' }}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleFileUpload('self-employed-proof-2', e.target.files[0])}
                  />
                </div>
                <div className="document-upload-group">
                  <h3>Company address proof</h3>
                  <div className="upload-box large" onClick={() => triggerFileInput('company-address-proof')}>
                    <div className="upload-icon">📁</div>
                    <span>{uploadedFiles['company-address-proof'] ? uploadedFiles['company-address-proof'].name : 'Click to upload'}</span>
                  </div>
                  <input
                    type="file"
                    id="company-address-proof"
                    style={{ display: 'none' }}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleFileUpload('company-address-proof', e.target.files[0])}
                  />
                </div>
              </div>
            </section>

            {/* Loan Details Section - FOURTH */}
            <section className="form-section">
              <h2>Please fill the Loan Details:</h2>
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
                    <option value="">Choose One</option>
                    <option value="gold">Gold Loan</option>
                    <option value="home">Home Loan</option>
                    <option value="education">Education Loan</option>
                    <option value="medical">Medical Loan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Loan Amount Required:</label>
                  <input
                    type="text"
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
                  <input
                    type="text"
                    name="loanDuration"
                    value={formData.loanDuration}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Purpose of Loan:</label>
                  <input
                    type="text"
                    name="loanPurpose"
                    value={formData.loanPurpose}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Document Upload Sections - Show only for selected loan type */}
              {formData.loanType && (
                <div className="document-sections">
                  <h3 style={{ marginTop: '30px', marginBottom: '20px', color: '#1e3a5f' }}>
                    Required Documents for {formData.loanType === 'gold' ? 'Gold Loan' : 
                                          formData.loanType === 'home' ? 'Home Loan' :
                                          formData.loanType === 'education' ? 'Education Loan' :
                                          formData.loanType === 'medical' ? 'Medical Loan' : ''}
                  </h3>
                  <div className="document-row">
                    {formData.loanType === 'gold' && (
                      <div className="document-group">
                        <h3>Gold Loan Documents</h3>
                        <div className="document-items">
                          <div className="document-item">
                            <span>KYC Document</span>
                            <div className="upload-box" onClick={() => triggerFileInput('kyc-document')}>
                              <div className="upload-icon">📁</div>
                              <span>{uploadedFiles['kyc-document'] ? uploadedFiles['kyc-document'].name : 'Click to upload'}</span>
                            </div>
                            <input
                              type="file"
                              id="kyc-document"
                              style={{ display: 'none' }}
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={(e) => handleFileUpload('kyc-document', e.target.files[0])}
                            />
                          </div>
                          <div className="document-item">
                            <span>Driving Licence</span>
                            <div className="upload-box" onClick={() => triggerFileInput('driving-licence')}>
                              <div className="upload-icon">📁</div>
                              <span>{uploadedFiles['driving-licence'] ? uploadedFiles['driving-licence'].name : 'Click to upload'}</span>
                            </div>
                            <input
                              type="file"
                              id="driving-licence"
                              style={{ display: 'none' }}
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={(e) => handleFileUpload('driving-licence', e.target.files[0])}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.loanType === 'home' && (
                      <div className="document-group">
                        <h3>Home Loan Documents</h3>
                        <div className="document-items">
                          <div className="document-item">
                            <span>Sale Agreement</span>
                            <div className="upload-box" onClick={() => triggerFileInput('sale-agreement')}>
                              <div className="upload-icon">📁</div>
                              <span>{uploadedFiles['sale-agreement'] ? uploadedFiles['sale-agreement'].name : 'Click to upload'}</span>
                            </div>
                            <input
                              type="file"
                              id="sale-agreement"
                              style={{ display: 'none' }}
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={(e) => handleFileUpload('sale-agreement', e.target.files[0])}
                            />
                          </div>
                          <div className="document-item">
                            <span>EC (Encumbrance Certificate)</span>
                            <div className="upload-box" onClick={() => triggerFileInput('ec-certificate')}>
                              <div className="upload-icon">📁</div>
                              <span>{uploadedFiles['ec-certificate'] ? uploadedFiles['ec-certificate'].name : 'Click to upload'}</span>
                            </div>
                            <input
                              type="file"
                              id="ec-certificate"
                              style={{ display: 'none' }}
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={(e) => handleFileUpload('ec-certificate', e.target.files[0])}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.loanType === 'education' && (
                      <div className="document-group">
                        <h3>Education Loan Documents</h3>
                        <div className="document-items">
                          <div className="document-item">
                            <span>Identity Proof</span>
                            <div className="upload-box" onClick={() => triggerFileInput('identity-proof')}>
                              <div className="upload-icon">📁</div>
                              <span>{uploadedFiles['identity-proof'] ? uploadedFiles['identity-proof'].name : 'Click to upload'}</span>
                            </div>
                            <input
                              type="file"
                              id="identity-proof"
                              style={{ display: 'none' }}
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={(e) => handleFileUpload('identity-proof', e.target.files[0])}
                            />
                          </div>
                          <div className="document-item">
                            <span>Latest Passport Photo</span>
                            <div className="upload-box" onClick={() => triggerFileInput('passport-photo')}>
                              <div className="upload-icon">📁</div>
                              <span>{uploadedFiles['passport-photo'] ? uploadedFiles['passport-photo'].name : 'Click to upload'}</span>
                            </div>
                            <input
                              type="file"
                              id="passport-photo"
                              style={{ display: 'none' }}
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={(e) => handleFileUpload('passport-photo', e.target.files[0])}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.loanType === 'medical' && (
                      <div className="document-group">
                        <h3>Medical Loan Documents</h3>
                        <div className="document-items">
                          <div className="document-item">
                            <span>Medical Reg. Certificate</span>
                            <div className="upload-box" onClick={() => triggerFileInput('medical-certificate')}>
                              <div className="upload-icon">📁</div>
                              <span>{uploadedFiles['medical-certificate'] ? uploadedFiles['medical-certificate'].name : 'Click to upload'}</span>
                            </div>
                            <input
                              type="file"
                              id="medical-certificate"
                              style={{ display: 'none' }}
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={(e) => handleFileUpload('medical-certificate', e.target.files[0])}
                            />
                          </div>
                          <div className="document-item">
                            <span>Address Proof</span>
                            <div className="upload-box" onClick={() => triggerFileInput('address-proof')}>
                              <div className="upload-icon">📁</div>
                              <span>{uploadedFiles['address-proof'] ? uploadedFiles['address-proof'].name : 'Click to upload'}</span>
                            </div>
                            <input
                              type="file"
                              id="address-proof"
                              style={{ display: 'none' }}
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={(e) => handleFileUpload('address-proof', e.target.files[0])}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Show message when no loan type is selected */}
              {!formData.loanType && (
                <div className="document-sections">
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px', 
                    color: '#666', 
                    fontStyle: 'italic',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    margin: '20px 0'
                  }}>
                    Please select a loan type above to see the required documents
                  </div>
                </div>
              )}
            </section>

            {/* Existing Loan Details Section */}
            <section className="form-section">
              <h2>Please fill Existing Loan Details (if any):</h2>
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
                  <input
                    type="text"
                    name="existingLoanType"
                    value={formData.existingLoanType}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    className="form-input"
                  />
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
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Outstanding Amount:</label>
                  <input
                    type="text"
                    name="existingLoanOutstandingAmount"
                    value={formData.existingLoanOutstandingAmount}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Address:</label>
                  <input
                    type="text"
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
                    type="text"
                    name="existingLoanEMITenure"
                    value={formData.existingLoanEMITenure}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    className="form-input"
                  />
                </div>
              </div>
            </section>

            {/* References Section */}
            <section className="form-section">
              <h2>References:</h2>
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
                      touched.referenceFullName && errors.referenceFullName
                        ? "error"
                        : ""
                    }`}
                    required
                  />
                  {touched.referenceFullName && errors.referenceFullName && (
                    <small className="error-text">
                      {errors.referenceFullName}
                    </small>
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
                    className="form-input"
                    required
                  />
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
                      touched.referenceContactNumber &&
                      errors.referenceContactNumber
                        ? "error"
                        : ""
                    }`}
                    required
                  />
                  {touched.referenceContactNumber &&
                    errors.referenceContactNumber && (
                      <small className="error-text">
                        {errors.referenceContactNumber}
                      </small>
                    )}
                </div>
                <div className="form-group">
                  <label>Address:</label>
                  <input
                    type="text"
                    name="referenceAddress"
                    value={formData.referenceAddress}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type here"
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="form-submit-section">
              <button type="submit" className="submit-btn">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoanApplicationForm;
