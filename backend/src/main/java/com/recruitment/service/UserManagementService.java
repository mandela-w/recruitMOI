package com.recruitment.service;

import com.recruitment.dto.request.CreateUserRequest;
import com.recruitment.dto.request.ResetPasswordRequest;
import com.recruitment.dto.request.UpdateUserRequest;
import com.recruitment.dto.response.DashboardStatsResponse;
import com.recruitment.dto.response.UserResponse;
import com.recruitment.enums.Role;

import java.util.List;
import java.util.UUID;

public interface UserManagementService {
    UserResponse createUser(CreateUserRequest request);
    List<UserResponse> getAllUsers();
    List<UserResponse> getUsersByRole(Role role);
    List<UserResponse> getUsersByStatus(boolean active);
    UserResponse getUserById(UUID userId);
    UserResponse updateUser(UUID userId, UpdateUserRequest request);
    void activateUser(UUID userId);
    void deactivateUser(UUID userId);
    void resetUserPassword(UUID userId, ResetPasswordRequest request);
    void deleteUser(UUID userId);
    DashboardStatsResponse getDashboardStats();
}
