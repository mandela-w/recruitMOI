package com.recruitment.service.impl;

import com.recruitment.entity.RefreshToken;
import com.recruitment.entity.User;
import com.recruitment.exception.UnauthorizedException;
import com.recruitment.repository.RefreshTokenRepository;
import com.recruitment.security.JwtProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProperties jwtProperties;

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        refreshTokenRepository.deleteByUser(user);

        RefreshToken token = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiresAt(LocalDateTime.now().plusDays(jwtProperties.getRefreshTokenExpirationDays()))
                .build();

        return refreshTokenRepository.save(token);
    }

    @Transactional(readOnly = true)
    public RefreshToken validateRefreshToken(String tokenValue) {
        RefreshToken token = refreshTokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (token.isRevoked()) {
            throw new UnauthorizedException("Refresh token has been revoked");
        }
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new UnauthorizedException("Refresh token has expired. Please login again.");
        }

        return token;
    }

    @Transactional
    public void revokeByUser(User user) {
        refreshTokenRepository.findByUser(user).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }
}
