package com.recruitment.service.impl;

import com.recruitment.dto.request.CreateUserRequest;
import com.recruitment.dto.request.ResetPasswordRequest;
import com.recruitment.dto.request.UpdateUserRequest;
import com.recruitment.dto.response.DashboardStatsResponse;
import com.recruitment.dto.response.UserResponse;
import com.recruitment.entity.User;
import com.recruitment.enums.ApplicationStatus;
import com.recruitment.enums.Role;
import com.recruitment.exception.BadRequestException;
import com.recruitment.exception.ConflictException;
import com.recruitment.exception.ResourceNotFoundException;
import com.recruitment.repository.ApplicationRepository;
import com.recruitment.repository.UserRepository;
import com.recruitment.service.EmailService;
import com.recruitment.service.UserManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserManagementServiceImpl implements UserManagementService {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("A user with this email already exists");
        }
        if (request.getRole() == Role.APPLICANT) {
            throw new BadRequestException("Applicant accounts are self-registered.");
        }

        String plainPassword = request.getPassword();

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(plainPassword))
                .role(request.getRole())
                .build();

        User saved = userRepository.save(user);
        log.info("User created — role: {} email: {}", request.getRole(), request.getEmail());
        emailService.sendHrAccountCredentials(saved.getEmail(), saved.getFirstName(), plainPassword);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByRole(Role role) {
        return userRepository.findAllByRoleOrderByFirstNameAsc(role).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByStatus(boolean active) {
        return userRepository.findAllByActiveOrderByFirstNameAsc(active).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID userId) {
        return toResponse(findById(userId));
    }

    @Override
    @Transactional
    public UserResponse updateUser(UUID userId, UpdateUserRequest request) {
        User user = findById(userId);
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName()  != null) user.setLastName(request.getLastName());
        return toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void activateUser(UUID userId) {
        User user = findById(userId);
        if (user.isActive()) throw new BadRequestException("Account is already active");
        user.setActive(true);
        userRepository.save(user);
        log.info("User activated: {}", userId);
    }

    @Override
    @Transactional
    public void deactivateUser(UUID userId) {
        User user = findById(userId);
        if (!user.isActive()) throw new BadRequestException("Account is already inactive");
        user.setActive(false);
        userRepository.save(user);
        log.info("User deactivated: {}", userId);
    }

    @Override
    @Transactional
    public void resetUserPassword(UUID userId, ResetPasswordRequest request) {
        User user = findById(userId);
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password reset for user: {}", userId);
    }

    @Override
    @Transactional
    public void deleteUser(UUID userId) {
        User user = findById(userId);
        if (user.getRole() == Role.SUPER_ADMIN) {
            throw new BadRequestException("The Super Admin account cannot be deleted");
        }
        userRepository.delete(user);
        log.info("User deleted: {}", userId);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        return DashboardStatsResponse.builder()
                .totalApplications(applicationRepository.count())
                .submitted(applicationRepository.countByStatus(ApplicationStatus.SUBMITTED))
                .underReview(applicationRepository.countByStatus(ApplicationStatus.UNDER_REVIEW))
                .approved(applicationRepository.countByStatus(ApplicationStatus.APPROVED))
                .rejected(applicationRepository.countByStatus(ApplicationStatus.REJECTED))
                .totalUsers(userRepository.count())
                .totalApplicants(userRepository.countByRole(Role.APPLICANT))
                .totalHrUsers(userRepository.countByRole(Role.HR))
                .activeUsers(userRepository.countByActive(true))
                .build();
    }

    private User findById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
