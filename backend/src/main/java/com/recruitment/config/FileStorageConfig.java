package com.recruitment.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.file")
public class FileStorageConfig {
    private String uploadDir = "uploads/cvs";
    private long maxSizeBytes = 10485760; // 10MB
}
