package com.recruitment.controller;

import com.recruitment.dto.response.ApiResponse;
import com.recruitment.dto.response.DashboardStatsResponse;
import com.recruitment.service.UserManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('HR', 'SUPER_ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Dashboard", description = "Statistical overview for HR and Admin users")
public class DashboardController {

    private final UserManagementService userManagementService;

    @GetMapping("/stats")
    @Operation(summary = "Get all dashboard statistics including application counts and user metrics")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = userManagementService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
