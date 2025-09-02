//LoanApplicationService.java

package com.scb.loan.service;

import com.scb.loan.model.*;
import com.scb.loan.repository.LoanApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoanApplicationService {

    @Autowired
    private LoanApplicationRepository loanApplicationRepository;

    // --- Create New Application ---
    public LoanApplication createNewApplication() {
        LoanApplication application = new LoanApplication();
        return loanApplicationRepository.save(application);
    }

    // --- Save Personal Details ---
    public LoanApplication savePersonalDetails(Long applicationId, PersonalDetails details) {
        LoanApplication application = getApplicationById(applicationId);
        details.setLoanApplication(application);
        application.setPersonalDetails(details);
        return loanApplicationRepository.save(application);
    }

    // --- Save Employment Details ---
    public LoanApplication saveEmploymentDetails(Long applicationId, EmploymentDetails details) {
        LoanApplication application = getApplicationById(applicationId);
        details.setLoanApplication(application);
        application.setEmploymentDetails(details);
        return loanApplicationRepository.save(application);
    }

    // --- Save Loan Details ---
    public LoanApplication saveLoanDetails(Long applicationId, LoanDetails details) {
        LoanApplication application = getApplicationById(applicationId);
        details.setLoanApplication(application);
        application.setLoanDetails(details);
        return loanApplicationRepository.save(application);
    }

    // --- Save Document Details ---
    public LoanApplication saveDocumentDetails(Long applicationId, DocumentDetails details) {
        LoanApplication application = getApplicationById(applicationId);
        details.setLoanApplication(application);
        application.setDocumentDetails(details);
        return loanApplicationRepository.save(application);
    }

    // --- Save Existing Loan Details ---
    public LoanApplication saveExistingLoanDetails(Long applicationId, ExistingLoanDetails details) {
        LoanApplication application = getApplicationById(applicationId);
        details.setLoanApplication(application);
        application.setExistingLoanDetails(details);
        return loanApplicationRepository.save(application);
    }

    // --- Save Reference Details ---
    public LoanApplication saveReferenceDetails(Long applicationId, ReferenceDetails details) {
        LoanApplication application = getApplicationById(applicationId);
        details.setLoanApplication(application);
        application.setReferenceDetails(details);
        return loanApplicationRepository.save(application);
    }

    // --- Fetch Application by ID ---
    public LoanApplication getApplicationById(Long id) {
        return loanApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
    }
}
***********************************************************************
