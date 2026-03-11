package com.recruitment.service.impl;

import com.recruitment.dto.request.LoginRequest;
import com.recruitment.dto.request.RefreshTokenRequest;
import com.recruitment.dto.request.RegisterRequest;
import com.recruitment.dto.response.AuthResponse;
import com.recruitment.dto.response.UserResponse;
import com.recruitment.entity.RefreshToken;
import com.recruitment.entity.User;
import com.recruitment.enums.Role;
import com.recruitment.exception.ConflictException;
import com.recruitment.repository.UserRepository;
import com.recruitment.security.JwtProperties;
import com.recruitment.security.JwtService;
import com.recruitment.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenServiceImpl refreshTokenService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("An account with this email already exists");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.APPLICANT)
                .build();

        User savedUser = userRepository.save(user);
        return buildAuthResponse(savedUser);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenService.validateRefreshToken(request.getRefreshToken());
        User user = refreshToken.getUser();
        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public void logout(String userEmail) {
        userRepository.findByEmail(userEmail)
                .ifPresent(refreshTokenService::revokeByUser);
    }

    private AuthResponse buildAuthResponse(User user) {
        Map<String, Object> claims = Map.of(
                "role", user.getRole().name(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName()
        );

        String accessToken = jwtService.generateAccessToken(user.getEmail(), claims);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(jwtProperties.getAccessTokenExpirationMs() / 1000)
                .user(toUserResponse(user))
                .build();
    }

    private UserResponse toUserResponse(User user) {
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
