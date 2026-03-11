package com.recruitment.util;

import com.recruitment.config.FileStorageConfig;
import com.recruitment.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileStorageService {

    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    private final FileStorageConfig fileStorageConfig;

    public String storeFile(MultipartFile file, String userId) {
        validateFile(file);

        try {
            Path uploadPath = Paths.get(fileStorageConfig.getUploadDir()).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String originalFilename = file.getOriginalFilename();
            String extension = getFileExtension(originalFilename);
            String storedFilename = userId + "_" + UUID.randomUUID() + extension;

            Path targetLocation = uploadPath.resolve(storedFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            log.info("File stored successfully: {}", storedFilename);
            return targetLocation.toString();
        } catch (IOException ex) {
            throw new BadRequestException("Could not store file. Please try again.");
        }
    }

    public void deleteFile(String filePath) {
        if (filePath == null) return;
        try {
            Path path = Paths.get(filePath);
            Files.deleteIfExists(path);
        } catch (IOException ex) {
            log.warn("Failed to delete file: {}", filePath);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("CV file is required");
        }
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new BadRequestException("Only PDF, DOC, and DOCX files are allowed");
        }
        if (file.getSize() > fileStorageConfig.getMaxSizeBytes()) {
            throw new BadRequestException("File size exceeds the 10MB limit");
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }
}
