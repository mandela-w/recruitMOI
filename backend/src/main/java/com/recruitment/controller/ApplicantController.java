package com.recruitment.controller;

import com.recruitment.dto.request.ApplicationSubmitRequest;
import com.recruitment.dto.request.UpdateApplicationRequest;
import com.recruitment.dto.response.ApiResponse;
import com.recruitment.dto.response.ApplicationResponse;
import com.recruitment.service.ApplicationService;
import com.recruitment.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/applicant")
@RequiredArgsConstructor
@PreAuthorize("hasRole('APPLICANT')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Applicant", description = "Applicant application management")
public class ApplicantController {

    private final ApplicationService applicationService;

    @PostMapping(value = "/application", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Submit a new application with CV file")
    public ResponseEntity<ApiResponse<ApplicationResponse>> submitApplication(
            @Valid @RequestPart("data") ApplicationSubmitRequest request,
            @RequestPart("cv") MultipartFile cvFile
    ) {
        String userEmail = SecurityUtils.getCurrentUserEmail();
        ApplicationResponse response = applicationService.submitApplication(request, cvFile, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application submitted successfully", response));
    }

    @GetMapping("/application")
    @Operation(summary = "View my application and its current status")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getMyApplication() {
        ApplicationResponse response = applicationService.getMyApplication(SecurityUtils.getCurrentUserEmail());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping(value = "/application", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
        summary = "Update my application",
        description = "Only allowed while status is SUBMITTED. CV file replacement is optional."
    )
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateMyApplication(
            @RequestPart("data") UpdateApplicationRequest request,
            @RequestPart(value = "cv", required = false) MultipartFile cvFile
    ) {
        String userEmail = SecurityUtils.getCurrentUserEmail();
        ApplicationResponse response = applicationService.updateMyApplication(request, cvFile, userEmail);
        return ResponseEntity.ok(ApiResponse.success("Application updated successfully", response));
    }
}
