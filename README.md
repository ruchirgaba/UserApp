package com.scb.loan.controller;

import com.scb.loan.model.*;
import com.scb.loan.service.LoanApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
public class LoanApplicationController {

    @Autowired
    private LoanApplicationService loanApplicationService;

    // --- Create new application ---
    @PostMapping("/create")
    public LoanApplication createApplication() {
        return loanApplicationService.createNewApplication();
    }

    // --- Save Personal Details ---
    @PostMapping("/{id}/personal-details")
    public LoanApplication savePersonalDetails(@PathVariable Long id, @RequestBody PersonalDetails details) {
        return loanApplicationService.savePersonalDetails(id, details);
    }

    // --- Save Employment Details ---
    @PostMapping("/{id}/employment-details")
    public LoanApplication saveEmploymentDetails(@PathVariable Long id, @RequestBody EmploymentDetails details) {
        return loanApplicationService.saveEmploymentDetails(id, details);
    }

    // --- Save Loan Details ---
    @PostMapping("/{id}/loan-details")
    public LoanApplication saveLoanDetails(@PathVariable Long id, @RequestBody LoanDetails details) {
        return loanApplicationService.saveLoanDetails(id, details);
    }

    // --- Save Document Details ---
    @PostMapping("/{id}/document-details")
    public LoanApplication saveDocumentDetails(@PathVariable Long id, @RequestBody DocumentDetails details) {
        return loanApplicationService.saveDocumentDetails(id, details);
    }

    // --- Save Existing Loan Details ---
    @PostMapping("/{id}/existing-loan-details")
    public LoanApplication saveExistingLoanDetails(@PathVariable Long id, @RequestBody ExistingLoanDetails details) {
        return loanApplicationService.saveExistingLoanDetails(id, details);
    }

    // --- Save Reference Details ---
    @PostMapping("/{id}/reference-details")
    public LoanApplication saveReferenceDetails(@PathVariable Long id, @RequestBody ReferenceDetails details) {
        return loanApplicationService.saveReferenceDetails(id, details);
    }

    // --- Fetch application by ID ---
    @GetMapping("/{id}")
    public LoanApplication getApplication(@PathVariable Long id) {
        return loanApplicationService.getApplicationById(id);
    }
}
