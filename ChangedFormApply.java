import React, { useState } from "react";
import "../style/LoanApplicationForm.css";
import HeaderLoggedIn from "./HeaderLoggedIn";
import Footer from "./FooterLoggedIn";

const LoanApplicationForm = () => {
  // Step management & UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showReview, setShowReview] = useState(false);
  const [allSectionsCompleted, setAllSectionsCompleted] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, title: "Personal Details", key: "personal" },
    { id: 2, title: "Employment Details", key: "employment" },
    { id: 3, title: "Loan Details", key: "loan" },
    { id: 4, title: "Document Upload", key: "documents" },
    { id: 5, title: "Existing Loans", key: "existing" },
    { id: 6, title: "References", key: "references" },
    { id: 7, title: "Review Application", key: "review" }
  ];

  // initial form data (same fields as your original)
  const initialFormData = {
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

    // Existing Loan Details (optional)
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
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  // uploadedFiles will hold both single File objects and arrays for multiple uploads
  const [uploadedFiles, setUploadedFiles] = useState({
    panCard: null,
    aadharCard: null,
    salarySlips: [],        // multiple
    bankStatements: [],     // multiple
    photo: null,
  });

  // small helper: get current step object
  const currentStepData = steps.find(step => step.id === currentStep);
    // ---------------- API functions (defined but not invoked until submit) ----------------
  // Note: these functions mirror your original endpoints. They expect an applicationId.
  // handleSubmit will create the application first, then call these with that id.

  const createApplication = async () => {
    const response = await fetch('http://localhost:8080/api/applications/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error("Failed to create application");
    return await response.json(); // assume { id: ... }
  };

  const savePersonalDetails = async (applicationId, data) => {
    const personalData = {
      fullName: data.fullName || "",
      phoneNumber: data.phoneNumber || "",
      maritalStatus: data.maritalStatus || "",
      panNumber: data.panNumber || "",
      passportNumber: data.passportNumber || "",
      gender: data.gender || "",
      currentAddress: data.currentAddress || "",
      permanentAddress: data.permanentAddress || "",
      dateOfBirth: data.dateOfBirth || "",
    };

    const response = await fetch(`http://localhost:8080/api/applications/${applicationId}/personal-details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(personalData),
    });
    if (!response.ok) throw new Error("Failed to save personal details");
    return await response.json();
  };

  const saveEmploymentDetails = async (applicationId, data) => {
    const employmentData = {
      employmentType: data.occupationType || "",
      employerName: data.companyName || "",
      jobTitle: "Not specified",
      monthlyIncome: parseFloat(data.monthlyCompanyIncome) || 0,
      unemploymentIncome: parseFloat(data.unemploymentIncome) || 0,
      yearsOfExperience: parseFloat(data.totalWorkExperience) || 0,
      officeAddress: data.officeAddress || "",
    };

    const response = await fetch(`http://localhost:8080/api/applications/${applicationId}/employment-details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employmentData),
    });
    if (!response.ok) throw new Error("Failed to save employment details");
    return await response.json();
  };

  const saveLoanDetails = async (applicationId, data) => {
    const loanData = {
      loanType: data.loanType || "",
      loanAmount: parseFloat(data.loanAmount) || 0,
      loanTenure: parseInt(data.loanDuration) || 0,
      loanPurpose: data.loanPurpose || "",
    };

    const response = await fetch(`http://localhost:8080/api/applications/${applicationId}/loan-details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loanData),
    });
    if (!response.ok) throw new Error("Failed to save loan details");
    return await response.json();
  };

  // Document upload meta (you can adapt this if you plan to upload files to S3 or separately)
  // For now we send nulls like your original saveDocumentDetails did or we can send filenames if backend expects
  const saveDocumentDetails = async (applicationId, files) => {
    // If your backend supports multipart/form-data and file upload, you'd send FormData here.
    // For now we'll send filenames or null placeholders.
    const documentData = {
      panCardPath: files.panCard ? files.panCard.name : null,
      aadhaarCardPath: files.aadharCard ? files.aadharCard.name : null,
      salarySlipPaths: files.salarySlips && files.salarySlips.length ? files.salarySlips.map(f => f.name) : [],
      bankStatementPaths: files.bankStatements && files.bankStatements.length ? files.bankStatements.map(f => f.name) : [],
      photoPath: files.photo ? files.photo.name : null,
    };

    const response = await fetch(`http://localhost:8080/api/applications/${applicationId}/document-details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(documentData),
    });
    if (!response.ok) throw new Error("Failed to save document details");
    return await response.json();
  };

  const saveExistingLoanDetails = async (applicationId, data) => {
    // If empty, your backend might accept empty payload or you can skip
    if (!data.existingLoanFullName && !data.existingLoanType && !data.existingLoanLender) {
      return { message: "No existing loan data" };
    }

    const existingLoanData = {
      fullName: data.existingLoanFullName || "",
      loanType: data.existingLoanType || "",
      contactNumber: data.existingLoanContactNumber || "",
      lender: data.existingLoanLender || "",
      email: data.existingLoanEmail || "",
      outstandingAmount: data.existingLoanOutstandingAmount ? parseFloat(data.existingLoanOutstandingAmount) : null,
      address: data.existingLoanAddress || "",
      emiTenure: data.existingLoanEMITenure ? parseInt(data.existingLoanEMITenure) : null,
    };

    const response = await fetch(`http://localhost:8080/api/applications/${applicationId}/existing-loan-details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(existingLoanData),
    });
    if (!response.ok) throw new Error("Failed to save existing loan details");
    return await response.json();
  };

  const saveReferenceDetails = async (applicationId, data) => {
    const referenceData = {
      fullName: data.referenceFullName || "",
      relationshipWithApplicant: data.referenceRelationship || "",
      contactNumber: data.referenceContactNumber || "",
      address: data.referenceAddress || "",
    };

    const response = await fetch(`http://localhost:8080/api/applications/${applicationId}/reference-details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(referenceData),
    });
    if (!response.ok) throw new Error("Failed to save reference details");
    return await response.json();
  };

  // ---------------- VALIDATION ----------------
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value || !value.trim()) error = "Full name is required";
        else if (value.trim().length < 2) error = "Name must be at least 2 characters";
        break;
      case "phoneNumber":
        if (!value || !value.trim()) error = "Phone number is required";
        else if (!/^\d{10}$/.test(value.replace(/\D/g, ""))) error = "Please enter a valid 10-digit phone number";
        break;
      case "panNumber":
        if (!value || !value.trim()) error = "PAN number is required";
        else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase())) error = "Please enter a valid PAN number";
        break;
      case "currentAddress":
        if (!value || !value.trim()) error = "Current address is required";
        else if (value.trim().length < 10) error = "Please enter a complete address";
        break;
      case "permanentAddress":
        if (!value || !value.trim()) error = "Permanent address is required";
        else if (value.trim().length < 10) error = "Please enter a complete address";
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
        else if (isNaN(parseFloat(value)) || parseFloat(value) < 0) error = "Total work experience should be a valid number";
        break;
      case "monthlyCompanyIncome":
        if (!value || !value.toString().trim()) error = "Monthly income is required";
        else if (isNaN(value) || parseFloat(value) < 0) error = "Please enter a valid income amount";
        break;
      case "officeAddress":
        if (!value || !value.trim()) error = "Office address is required";
        break;
      case "loanType":
        if (!value || !value.trim()) error = "Loan type is required";
        break;
      case "loanAmount":
        if (!value || !value.toString().trim()) error = "Loan amount is required";
        else if (isNaN(value) || parseFloat(value) <= 0) error = "Please enter a valid amount";
        break;
      case "loanDuration":
        if (!value || !value.toString().trim()) error = "Loan duration is required";
        break;
      case "loanPurpose":
        if (!value || !value.trim()) error = "Loan purpose is required";
        break;
      case "existingLoanEmail":
        if (value && value.trim()) {
          const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
          if (!emailRegex.test(value.trim())) error = "Please enter a valid email address";
        }
        break;
      case "referenceFullName":
        if (!value || !value.trim()) error = "Reference name is required";
        break;
      case "referenceContactNumber":
        if (!value || !value.trim()) error = "Reference contact is required";
        else if (!/^\d{10}$/.test(value.replace(/\D/g, ""))) error = "Please enter a valid 10-digit phone number";
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

  const validateStep = (stepKey) => {
    const stepErrors = {};
    let isValid = true;

    switch (stepKey) {
      case "personal": {
        const personalFields = ["fullName", "phoneNumber", "panNumber", "currentAddress", "permanentAddress", "dateOfBirth", "maritalStatus", "gender"];
        personalFields.forEach(field => {
          const error = validateField(field, formData[field]);
          if (error) {
            stepErrors[field] = error;
            isValid = false;
          }
        });
        break;
      }
      case "employment": {
        const employmentFields = ["occupationType", "companyName", "totalWorkExperience", "monthlyCompanyIncome", "officeAddress"];
        employmentFields.forEach(field => {
          const error = validateField(field, formData[field]);
          if (error) {
            stepErrors[field] = error;
            isValid = false;
          }
        });
        break;
      }
      case "loan": {
        const loanFields = ["loanType", "loanAmount", "loanDuration", "loanPurpose"];
        loanFields.forEach(field => {
          const error = validateField(field, formData[field]);
          if (error) {
            stepErrors[field] = error;
            isValid = false;
          }
        });
        break;
      }
      case "documents":
        // skipping strict doc validation here
        isValid = true;
        break;
      case "existing":
        // optional - validate only email if present
        if (formData["existingLoanEmail"] && formData["existingLoanEmail"].trim() !== "") {
          const emailError = validateField("existingLoanEmail", formData["existingLoanEmail"]);
          if (emailError) {
            stepErrors["existingLoanEmail"] = emailError;
            isValid = false;
          }
        }
        break;
      case "references": {
        const referenceFields = ["referenceFullName", "referenceContactNumber", "referenceRelationship", "referenceAddress"];
        referenceFields.forEach(field => {
          const error = validateField(field, formData[field]);
          if (error) {
            stepErrors[field] = error;
            isValid = false;
          }
        });
        break;
      }
      default:
        break;
    }

    setErrors(prev => ({ ...prev, ...stepErrors }));
    return isValid;
  };
  // ---------------- INPUT & FILE HANDLERS ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // file upload: supports single and multiple
  const handleFileUpload = (documentType, files) => {
    // `files` should be an array (Array.from(e.target.files)) or a single File
    // Normalize to single or array per field
    setUploadedFiles(prev => {
      const next = { ...prev };
      if (Array.isArray(files)) {
        next[documentType] = files;
      } else {
        // single File
        next[documentType] = files;
      }
      return next;
    });
  };

  const triggerFileInput = (inputId) => {
    const el = document.getElementById(inputId);
    if (el) el.click();
  };

  // ---------------- STEP NAVIGATION ----------------
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

  const handleNextStep = () => {
    const current = steps.find(s => s.id === currentStep);
    if (validateStep(current.key)) {
      const newCompleted = new Set([...completedSteps, currentStep]);
      setCompletedSteps(newCompleted);

      if (currentStep === 6) {
        setShowReview(true);
        setCurrentStep(7);
        setAllSectionsCompleted(true);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      // mark fields as touched to show errors
      const stepFields = getStepFields(current.key);
      const newTouched = {};
      stepFields.forEach(f => newTouched[f] = true);
      setTouched(prev => ({ ...prev, ...newTouched }));
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      if (currentStep === 7) {
        setShowReview(false);
        setCurrentStep(6);
      } else {
        setCurrentStep(prev => prev - 1);
      }
    }
  };

  const handleEditSection = (sectionId) => {
    setEditingSection(sectionId);
    setShowReview(false);
    setCurrentStep(sectionId);
  };

  const handleReturnToReview = () => {
    // validate the edited section
    const current = steps.find(s => s.id === currentStep);
    if (validateStep(current.key)) {
      // mark as completed
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setEditingSection(null);
      setShowReview(true);
      setCurrentStep(7);
      alert("Section saved locally. Return to review and submit when ready.");
    } else {
      // mark fields touched to show errors
      const stepFields = getStepFields(current.key);
      const newTouched = {};
      stepFields.forEach(f => newTouched[f] = true);
      setTouched(prev => ({ ...prev, ...newTouched }));
    }
  };

  // ---------------- FINAL SUBMIT ----------------
  // On submit: create application, then save each section using returned id
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // final validation: ensure all required steps are valid
    const requiredSteps = steps.slice(0, 6);
    for (const step of requiredSteps) {
      if (!validateStep(step.key)) {
        // move to first invalid step
        const invalidIndex = steps.findIndex(s => s.key === step.key);
        setCurrentStep(step.id);
        alert("Please complete all required fields before submitting.");
        return;
      }
    }

    try {
      setLoading(true);

      // 1) create application (single creation)
      const app = await createApplication();
      const applicationId = app.id;
      if (!applicationId) throw new Error("No application ID returned from server");

      // 2) Call save endpoints using the applicationId
      await savePersonalDetails(applicationId, formData);
      await saveEmploymentDetails(applicationId, formData);
      await saveLoanDetails(applicationId, formData);
      await saveDocumentDetails(applicationId, uploadedFiles);
      await saveExistingLoanDetails(applicationId, formData);
      await saveReferenceDetails(applicationId, formData);

      alert("Application submitted successfully!");
      // Reset local state (optional)
      setFormData(initialFormData);
      setUploadedFiles({
        panCard: null,
        aadharCard: null,
        salarySlips: [],
        bankStatements: [],
        photo: null,
      });
      setCompletedSteps(new Set());
      setShowReview(false);
      setAllSectionsCompleted(false);
      setEditingSection(null);
      setCurrentStep(1);
    } catch (err) {
      console.error("Error during final submit:", err);
      alert("There was an error submitting your application. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // ---------------- RENDER HELPERS ----------------
  const renderProgressBar = () => {
    return (
      <div className="progress-container">
        <div className="progress-bar">
          {steps.map((step, index) => (
            <div key={step.id} className="progress-step">
              <div
                className={`step-circle ${
                  currentStep === step.id
                    ? 'active'
                    : completedSteps.has(step.id)
                    ? 'completed'
                    : 'pending'
                }`}
              >
                {completedSteps.has(step.id) ? '✓' : step.id}
              </div>
              <div className="step-label">{step.title}</div>
              {index < steps.length - 1 && (
                <div
                  className={`step-connector ${completedSteps.has(step.id) ? 'completed' : 'pending'}`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Personal Details
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
            className={`form-input ${touched.fullName && errors.fullName ? "error" : ""}`}
            required
          />
          {touched.fullName && errors.fullName && (<small className="error-text">{errors.fullName}</small>)}
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
            className={`form-input ${touched.phoneNumber && errors.phoneNumber ? "error" : ""}`}
            required
          />
          {touched.phoneNumber && errors.phoneNumber && (<small className="error-text">{errors.phoneNumber}</small>)}
        </div>

        <div className="form-group">
          <label>Marital Status:</label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`form-input ${touched.maritalStatus && errors.maritalStatus ? "error" : ""}`}
            required
          >
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
          {touched.maritalStatus && errors.maritalStatus && (<small className="error-text">{errors.maritalStatus}</small>)}
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
            className={`form-input ${touched.panNumber && errors.panNumber ? "error" : ""}`}
            required
          />
          {touched.panNumber && errors.panNumber && (<small className="error-text">{errors.panNumber}</small>)}
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
            className={`form-input ${touched.gender && errors.gender ? "error" : ""}`}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {touched.gender && errors.gender && (<small className="error-text">{errors.gender}</small>)}
        </div>

        <div className="form-group">
          <label>Current Address:</label>
          <textarea
            name="currentAddress"
            value={formData.currentAddress}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className={`form-input ${touched.currentAddress && errors.currentAddress ? "error" : ""}`}
            required
          />
          {touched.currentAddress && errors.currentAddress && (<small className="error-text">{errors.currentAddress}</small>)}
        </div>

        <div className="form-group">
          <label>Permanent Address:</label>
          <textarea
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className={`form-input ${touched.permanentAddress && errors.permanentAddress ? "error" : ""}`}
            required
          />
          {touched.permanentAddress && errors.permanentAddress && (<small className="error-text">{errors.permanentAddress}</small>)}
        </div>

        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            onBlur={handleBlur}
            max={new Date().toISOString().split("T")[0]}
            className={`form-input ${touched.dateOfBirth && errors.dateOfBirth ? "error" : ""}`}
            required
          />
          {touched.dateOfBirth && errors.dateOfBirth && (<small className="error-text">{errors.dateOfBirth}</small>)}
        </div>
      </div>
    </section>
  );

  // Employment details
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
            className={`form-input ${touched.occupationType && errors.occupationType ? "error" : ""}`}
            required
          >
            <option value="">Select Occupation</option>
            <option value="salaried">Salaried</option>
            <option value="self-employed">Self Employed</option>
            <option value="business">Business Owner</option>
            <option value="freelancer">Freelancer</option>
          </select>
          {touched.occupationType && errors.occupationType && (<small className="error-text">{errors.occupationType}</small>)}
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
            className={`form-input ${touched.totalWorkExperience && errors.totalWorkExperience ? "error" : ""}`}
            required
          />
          {touched.totalWorkExperience && errors.totalWorkExperience && (<small className="error-text">{errors.totalWorkExperience}</small>)}
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
            className={`form-input ${touched.monthlyCompanyIncome && errors.monthlyCompanyIncome ? "error" : ""}`}
            required
          />
          {touched.monthlyCompanyIncome && errors.monthlyCompanyIncome && (<small className="error-text">{errors.monthlyCompanyIncome}</small>)}
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
            className={`form-input ${touched.companyName && errors.companyName ? "error" : ""}`}
            required
          />
          {touched.companyName && errors.companyName && (<small className="error-text">{errors.companyName}</small>)}
        </div>

        <div className="form-group">
          <label>Office Address:</label>
          <textarea
            name="officeAddress"
            value={formData.officeAddress}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className={`form-input ${touched.officeAddress && errors.officeAddress ? "error" : ""}`}
            required
          />
          {touched.officeAddress && errors.officeAddress && (<small className="error-text">{errors.officeAddress}</small>)}
        </div>
      </div>
    </section>
  );

  // Loan details
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
            className={`form-input ${touched.loanType && errors.loanType ? "error" : ""}`}
            required
          >
            <option value="">Select Loan Type</option>
            <option value="personal">Personal Loan</option>
            <option value="home">Home Loan</option>
            <option value="car">Car Loan</option>
            <option value="business">Business Loan</option>
            <option value="education">Education Loan</option>
          </select>
          {touched.loanType && errors.loanType && (<small className="error-text">{errors.loanType}</small>)}
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
            className={`form-input ${touched.loanAmount && errors.loanAmount ? "error" : ""}`}
            required
          />
          {touched.loanAmount && errors.loanAmount && (<small className="error-text">{errors.loanAmount}</small>)}
        </div>

        <div className="form-group">
          <label>Loan Duration:</label>
          <select
            name="loanDuration"
            value={formData.loanDuration}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`form-input ${touched.loanDuration && errors.loanDuration ? "error" : ""}`}
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
          {touched.loanDuration && errors.loanDuration && (<small className="error-text">{errors.loanDuration}</small>)}
        </div>

        <div className="form-group">
          <label>Loan Purpose:</label>
          <textarea
            name="loanPurpose"
            value={formData.loanPurpose}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Type here"
            className={`form-input ${touched.loanPurpose && errors.loanPurpose ? "error" : ""}`}
            required
          />
          {touched.loanPurpose && errors.loanPurpose && (<small className="error-text">{errors.loanPurpose}</small>)}
        </div>
      </div>
    </section>
  );

  // Document upload
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
            <button type="button" onClick={() => triggerFileInput("panCard")} className="upload-btn">
              {uploadedFiles.panCard ? "✓ Uploaded" : "Upload PAN Card"}
            </button>
            <div className="file-name">{uploadedFiles.panCard ? uploadedFiles.panCard.name : ""}</div>
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
            <button type="button" onClick={() => triggerFileInput("aadharCard")} className="upload-btn">
              {uploadedFiles.aadharCard ? "✓ Uploaded" : "Upload Aadhar Card"}
            </button>
            <div className="file-name">{uploadedFiles.aadharCard ? uploadedFiles.aadharCard.name : ""}</div>
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
              onChange={(e) => handleFileUpload("salarySlips", Array.from(e.target.files))}
              style={{ display: "none" }}
            />
            <button type="button" onClick={() => triggerFileInput("salarySlips")} className="upload-btn">
              {uploadedFiles.salarySlips && uploadedFiles.salarySlips.length ? "✓ Uploaded" : "Upload Salary Slips"}
            </button>
            <div className="file-name">{uploadedFiles.salarySlips && uploadedFiles.salarySlips.length ? uploadedFiles.salarySlips.map(f => f.name).join(", ") : ""}</div>
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
              onChange={(e) => handleFileUpload("bankStatements", Array.from(e.target.files))}
              style={{ display: "none" }}
            />
            <button type="button" onClick={() => triggerFileInput("bankStatements")} className="upload-btn">
              {uploadedFiles.bankStatements && uploadedFiles.bankStatements.length ? "✓ Uploaded" : "Upload Bank Statements"}
            </button>
            <div className="file-name">{uploadedFiles.bankStatements && uploadedFiles.bankStatements.length ? uploadedFiles.bankStatements.map(f => f.name).join(", ") : ""}</div>
          </div>
        </div>
      </div>
    </section>
  );

  // Existing Loans
  const renderExistingLoans = () => (
    <section className="form-section">
      <h2>Existing Loan Details (Optional)</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Full Name:</label>
          <input type="text" name="existingLoanFullName" value={formData.existingLoanFullName} onChange={handleInputChange} onBlur={handleBlur} placeholder="Type here" className="form-input" />
        </div>

        <div className="form-group">
          <label>Loan Type:</label>
          <select name="existingLoanType" value={formData.existingLoanType} onChange={handleInputChange} onBlur={handleBlur} className="form-input">
            <option value="">Select Loan Type</option>
            <option value="personal">Personal Loan</option>
            <option value="home">Home Loan</option>
            <option value="car">Car Loan</option>
            <option value="business">Business Loan</option>
            <option value="education">Education Loan</option>
          </select>
        </div>

        <div className="form-group">
          <label>Contact Number:</label>
          <input type="tel" name="existingLoanContactNumber" value={formData.existingLoanContactNumber} onChange={handleInputChange} onBlur={handleBlur} placeholder="Type here" className="form-input" />
        </div>

        <div className="form-group">
          <label>Lender:</label>
          <input type="text" name="existingLoanLender" value={formData.existingLoanLender} onChange={handleInputChange} onBlur={handleBlur} placeholder="Type here" className="form-input" />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="existingLoanEmail" value={formData.existingLoanEmail} onChange={handleInputChange} onBlur={handleBlur} placeholder="Type here" className={`form-input ${errors.existingLoanEmail ? "error" : ""}`} />
          {errors.existingLoanEmail && (<small className="error-text">{errors.existingLoanEmail}</small>)}
        </div>

        <div className="form-group">
          <label>Outstanding Amount:</label>
          <input type="number" name="existingLoanOutstandingAmount" value={formData.existingLoanOutstandingAmount} onChange={handleInputChange} onBlur={handleBlur} placeholder="Type here" className="form-input" />
        </div>

        <div className="form-group">
          <label>Address:</label>
          <textarea name="existingLoanAddress" value={formData.existingLoanAddress} onChange={handleInputChange} onBlur={handleBlur} placeholder="Type here" className="form-input" />
        </div>

        <div className="form-group">
          <label>EMI Tenure Remaining:</label>
          <input type="number" name="existingLoanEMITenure" value={formData.existingLoanEMITenure} onChange={handleInputChange} onBlur={handleBlur} placeholder="Type here" min="1" step="1" className="form-input" />
        </div>
      </div>
    </section>
  );

  // References
  const renderReferences = () => (
    <section className="form-section">
      <h2>Reference</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Full Name:</label>
          <input type="text" name="referenceFullName" value={formData.referenceFullName} onChange={handleInputChange} onBlur={handleBlur} placeholder="Type here" className={`form-input ${touched.referenceFullName && errors.referenceFullName ? "error" : ""}`} required />
          {touched.referenceFullName && errors.referenceFullName && (<small className="error-text">{errors.referenceFullName}</small>)}
        </div>

        <div className="form-group">
          <label>Relationship with Applicant:</label>
          <input type="text" name="referenceRelationship" value={formData.referenceRelationship} onChange={handleInputChange} onBlur={handleBlur} placeholder="Type here" className={`form-input ${touched.referenceRelationship && errors.referenceRelationship ? "error" : ""}`} required />
          {touched.referenceRelationship && errors.referenceRelationship && (<small className="error-text">{errors.referenceRelationship}</small>)}
        </div>

        <div className="form-group">
          <label>Contact Number:</label>
          <input type="tel" name="referenceContactNumber" value={formData.referenceContactNumber} onChange={handleInputChange} onBlur={handleBlur} placeholder="Type here" className={`form-input ${touched.referenceContactNumber && errors.referenceContactNumber ? "error" : ""}`} required />
          {touched.referenceContactNumber && errors.referenceContactNumber && (<small className="error-text">{errors.referenceContactNumber}</small>)}
        </div>

        <div className="form-group">
          <label>Address:</label>
          <textarea name="referenceAddress" value={formData.referenceAddress} onChange={handleInputChange} onBlur={handleBlur} placeholder="Type here" className={`form-input ${touched.referenceAddress && errors.referenceAddress ? "error" : ""}`} required />
          {touched.referenceAddress && errors.referenceAddress && (<small className="error-text">{errors.referenceAddress}</small>)}
        </div>
      </div>
    </section>
  );

  // Review section
  const renderReviewApplication = () => (
    <section className="form-section review-section">
      <h2>Review Your Application</h2>
      <p>Please review all the information you have provided before final submission.</p>

      <div className="review-container">
        {/* Personal Details Review */}
        <div className="review-section-card">
          <div className="review-header">
            <h3>Personal Details</h3>
            <button type="button" className="edit-btn" onClick={() => handleEditSection(1)}>Edit</button>
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
            <button type="button" className="edit-btn" onClick={() => handleEditSection(2)}>Edit</button>
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
            <button type="button" className="edit-btn" onClick={() => handleEditSection(3)}>Edit</button>
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
            <button type="button" className="edit-btn" onClick={() => handleEditSection(4)}>Edit</button>
          </div>
          <div className="review-content">
            <p><strong>PAN Card:</strong> {uploadedFiles.panCard ? uploadedFiles.panCard.name : 'Not uploaded'}</p>
            <p><strong>Aadhar Card:</strong> {uploadedFiles.aadharCard ? uploadedFiles.aadharCard.name : 'Not uploaded'}</p>
            <p><strong>Salary Slips:</strong> {uploadedFiles.salarySlips && uploadedFiles.salarySlips.length ? uploadedFiles.salarySlips.map(f => f.name).join(", ") : 'Not uploaded'}</p>
            <p><strong>Bank Statements:</strong> {uploadedFiles.bankStatements && uploadedFiles.bankStatements.length ? uploadedFiles.bankStatements.map(f => f.name).join(", ") : 'Not uploaded'}</p>
          </div>
        </div>

        {/* Existing Loans Review */}
        <div className="review-section-card">
          <div className="review-header">
            <h3>Existing Loans</h3>
            <button type="button" className="edit-btn" onClick={() => handleEditSection(5)}>Edit</button>
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
            <button type="button" className="edit-btn" onClick={() => handleEditSection(6)}>Edit</button>
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

  // Renders the current step's content
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderPersonalDetails();
      case 2: return renderEmploymentDetails();
      case 3: return renderLoanDetails();
      case 4: return renderDocumentUpload();
      case 5: return renderExistingLoans();
      case 6: return renderReferences();
      case 7: return renderReviewApplication();
      default: return null;
    }
  };

  // ---------------- FINAL RETURN JSX ----------------
  return (
    <div className="loan-application-container">
      <HeaderLoggedIn />
      <main className="application-main">
        <div className="container">
          <div className="application-header">
            <h1>Loan Application Form</h1>
            <p>Please fill out all the required information below</p>
          </div>

          {renderProgressBar()}

          <form className="loan-form" onSubmit={handleSubmit}>
            {renderCurrentStep()}

            <div className="form-navigation">
              <div className="nav-buttons">
                {currentStep > 1 && currentStep !== 7 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="nav-btn prev-btn"
                    disabled={loading}
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
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save & Return to Review'}
                  </button>
                ) : currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="nav-btn next-btn"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Next →'}
                  </button>
                ) : currentStep === 6 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="nav-btn next-btn"
                    style={{ backgroundColor: '#4CAF50' }}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Review Application →'}
                  </button>
                ) : (
                  // final step (7) will show submit
                  <button 
                    type="submit" 
                    className="nav-btn submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </button>
                )}
              </div>

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
