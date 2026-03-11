package com.recruitment.service;

import com.recruitment.dto.request.LoginRequest;
import com.recruitment.dto.request.RefreshTokenRequest;
import com.recruitment.dto.request.RegisterRequest;
import com.recruitment.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    void logout(String userEmail);
}
