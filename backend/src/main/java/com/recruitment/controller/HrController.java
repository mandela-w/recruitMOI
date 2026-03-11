package com.recruitment.controller;

import com.recruitment.dto.request.ApplicationReviewRequest;
import com.recruitment.dto.response.AnalyticsResponse;
import com.recruitment.dto.response.ApiResponse;
import com.recruitment.dto.response.ApplicationResponse;
import com.recruitment.enums.ApplicationStatus;
import com.recruitment.service.AnalyticsService;
import com.recruitment.service.ApplicationService;
import com.recruitment.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/hr")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('HR', 'SUPER_ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "HR", description = "Application management and analytics for HR personnel")
public class HrController {

    private final ApplicationService applicationService;
    private final AnalyticsService analyticsService;

    // Application listing 

    @GetMapping("/applications")
    @Operation(summary = "Latest 10 applications sorted alphabetically")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getTop10Applications() {
        return ResponseEntity.ok(ApiResponse.success(applicationService.getTop10Applications()));
    }

    @GetMapping("/applications/all")
    @Operation(summary = "All applications sorted alphabetically")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getAllApplications() {
        return ResponseEntity.ok(ApiResponse.success(applicationService.getAllApplications()));
    }

    @GetMapping("/applications/filter")
    @Operation(summary = "Filter applications by status")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> filterByStatus(
            @Parameter(description = "SUBMITTED | UNDER_REVIEW | APPROVED | REJECTED")
            @RequestParam ApplicationStatus status
    ) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.getApplicationsByStatus(status)));
    }

    @GetMapping("/applications/search")
    @Operation(summary = "Search applicants by first name, last name, or National ID")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> searchApplications(
            @RequestParam String keyword
    ) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.searchApplications(keyword)));
    }

    @GetMapping("/applications/{applicationId}")
    @Operation(summary = "Get full details of one applicant")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getApplicationById(
            @PathVariable UUID applicationId
    ) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.getApplicationById(applicationId)));
    }

    // Review

    @PatchMapping("/applications/{applicationId}/review")
    @Operation(
        summary = "Review an application",
        description = "Sets status to UNDER_REVIEW, APPROVED, or REJECTED. A reason is always required."
    )
    public ResponseEntity<ApiResponse<ApplicationResponse>> reviewApplication(
            @PathVariable UUID applicationId,
            @Valid @RequestBody ApplicationReviewRequest request
    ) {
        String reviewerEmail = SecurityUtils.getCurrentUserEmail();
        ApplicationResponse response = applicationService.reviewApplication(applicationId, request, reviewerEmail);
        return ResponseEntity.ok(ApiResponse.success("Application reviewed successfully", response));
    }

    // Analytics

    @GetMapping("/analytics")
    @Operation(
        summary = "Full analytics dashboard",
        description = "Returns application funnel, monthly trend, combination breakdown, approval rates and user metrics."
    )
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getFullAnalytics()));
    }
}
