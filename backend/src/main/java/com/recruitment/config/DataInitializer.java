package com.recruitment.config;

import com.recruitment.entity.User;
import com.recruitment.enums.Role;
import com.recruitment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;


@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String DEFAULT_ADMIN_EMAIL = "admin@recruitment.rw";
    private static final String DEFAULT_ADMIN_PASSWORD = "Admin@12345";

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail(DEFAULT_ADMIN_EMAIL)) {
            User superAdmin = User.builder()
                    .firstName("System")
                    .lastName("Administrator")
                    .email(DEFAULT_ADMIN_EMAIL)
                    .password(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD))
                    .role(Role.SUPER_ADMIN)
                    .build();

            userRepository.save(superAdmin);
            log.info("✅ Default Super Admin created. Email: {} | Password: {}",
                    DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD);
            log.warn("⚠️  Please change the default admin password immediately after first login!");
        }
    }
}
