package com.recruitment.controller;

import com.recruitment.dto.request.CreateUserRequest;
import com.recruitment.dto.request.ResetPasswordRequest;
import com.recruitment.dto.request.UpdateUserRequest;
import com.recruitment.dto.response.AnalyticsResponse;
import com.recruitment.dto.response.ApiResponse;
import com.recruitment.dto.response.UserResponse;
import com.recruitment.enums.Role;
import com.recruitment.service.AnalyticsService;
import com.recruitment.service.UserManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Super Admin", description = "Full user management and system analytics")
public class AdminController {

    private final UserManagementService userManagementService;
    private final AnalyticsService analyticsService;

    // User creation

    @PostMapping("/users")
    @Operation(
        summary = "Create an HR or Admin account",
        description = "Account is created and credentials are emailed to the new user automatically."
    )
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse response = userManagementService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created and credentials sent by email", response));
    }

    // User listing and filtering

    @GetMapping("/users")
    @Operation(summary = "List all system users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userManagementService.getAllUsers()));
    }

    @GetMapping("/users/by-role")
    @Operation(summary = "Filter users by role")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersByRole(
            @Parameter(description = "HR | SUPER_ADMIN | APPLICANT")
            @RequestParam Role role
    ) {
        return ResponseEntity.ok(ApiResponse.success(userManagementService.getUsersByRole(role)));
    }

    @GetMapping("/users/by-status")
    @Operation(summary = "Filter users by active or inactive status")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersByStatus(
            @RequestParam boolean active
    ) {
        return ResponseEntity.ok(ApiResponse.success(userManagementService.getUsersByStatus(active)));
    }

    @GetMapping("/users/{userId}")
    @Operation(summary = "Get a specific user by ID")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable UUID userId) {
        return ResponseEntity.ok(ApiResponse.success(userManagementService.getUserById(userId)));
    }

    // User updates 

    @PatchMapping("/users/{userId}")
    @Operation(summary = "Update user name fields")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable UUID userId,
            @RequestBody UpdateUserRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success("User updated successfully", userManagementService.updateUser(userId, request))
        );
    }

    @PatchMapping("/users/{userId}/activate")
    @Operation(summary = "Activate a deactivated account")
    public ResponseEntity<ApiResponse<Void>> activateUser(@PathVariable UUID userId) {
        userManagementService.activateUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Account activated", null));
    }

    @PatchMapping("/users/{userId}/deactivate")
    @Operation(summary = "Deactivate an account — user can no longer log in")
    public ResponseEntity<ApiResponse<Void>> deactivateUser(@PathVariable UUID userId) {
        userManagementService.deactivateUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Account deactivated", null));
    }

    @PatchMapping("/users/{userId}/reset-password")
    @Operation(summary = "Reset a user's password on their behalf")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @PathVariable UUID userId,
            @Valid @RequestBody ResetPasswordRequest request
    ) {
        userManagementService.resetUserPassword(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully", null));
    }

    @DeleteMapping("/users/{userId}")
    @Operation(summary = "Permanently delete a user and all their data")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID userId) {
        userManagementService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User permanently deleted", null));
    }

    // Analytics

    @GetMapping("/analytics")
    @Operation(
        summary = "Full system analytics",
        description = "Application funnel, monthly trends, combination breakdown, user metrics and approval rates."
    )
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getFullAnalytics()));
    }
}
