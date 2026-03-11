package com.recruitment.controller;

import com.recruitment.dto.response.ApiResponse;
import com.recruitment.dto.response.UserResponse;
import com.recruitment.entity.User;
import com.recruitment.exception.ResourceNotFoundException;
import com.recruitment.repository.UserRepository;
import com.recruitment.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/me")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Profile", description = "Logged-in user's own profile — available to all roles")
public class UserProfileController {

    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get the currently authenticated user's profile")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile() {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserResponse response = UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
