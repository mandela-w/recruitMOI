package com.recruitment.service;

import com.recruitment.dto.request.RegisterRequest;
import com.recruitment.dto.response.AuthResponse;
import com.recruitment.entity.User;
import com.recruitment.enums.Role;
import com.recruitment.exception.ConflictException;
import com.recruitment.repository.UserRepository;
import com.recruitment.security.JwtProperties;
import com.recruitment.security.JwtService;
import com.recruitment.service.impl.AuthServiceImpl;
import com.recruitment.service.impl.RefreshTokenServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private JwtProperties jwtProperties;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private RefreshTokenServiceImpl refreshTokenService;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");
        registerRequest.setEmail("john.doe@example.com");
        registerRequest.setPassword("Password123!");
    }

    @Test
    @DisplayName("Register should throw ConflictException when email already exists")
    void register_shouldThrowConflictException_whenEmailAlreadyExists() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("already exists");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Register should create applicant account with APPLICANT role")
    void register_shouldCreateApplicantAccount_withApplicantRole() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");

        User savedUser = User.builder()
                .id(UUID.randomUUID())
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("hashedPassword")
                .role(Role.APPLICANT)
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateAccessToken(anyString(), anyMap())).thenReturn("mock-access-token");
        when(refreshTokenService.createRefreshToken(any())).thenReturn(
                com.recruitment.entity.RefreshToken.builder()
                        .token("mock-refresh-token")
                        .user(savedUser)
                        .expiresAt(java.time.LocalDateTime.now().plusDays(7))
                        .build()
        );
        when(jwtProperties.getAccessTokenExpirationMs()).thenReturn(900000L);

        AuthResponse response = authService.register(registerRequest);

        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("mock-access-token");
        assertThat(response.getUser().getRole()).isEqualTo(Role.APPLICANT);
        assertThat(response.getUser().getEmail()).isEqualTo("john.doe@example.com");
    }
}